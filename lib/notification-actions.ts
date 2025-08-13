"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Get user's notifications
export async function getUserNotifications() {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: "You must be logged in" }
    }

    const { data, error } = await supabase
      .from("notifications")
      .select(`
        *,
        grievance:grievance_id (
          id,
          title,
          status
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching notifications:", error)
      return { error: "Failed to fetch notifications" }
    }

    return { data }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Mark notification as read
export async function markNotificationAsRead(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const notificationId = formData.get("notificationId")

  if (!notificationId) {
    return { error: "Notification ID is required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: "You must be logged in" }
    }

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId.toString())
      .eq("user_id", user.id) // Ensure user can only mark their own notifications

    if (error) {
      console.error("Error marking notification as read:", error)
      return { error: "Failed to mark notification as read" }
    }

    return { success: "Notification marked as read" }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Mark all notifications as read
export async function markAllNotificationsAsRead() {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: "You must be logged in" }
    }

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false)

    if (error) {
      console.error("Error marking all notifications as read:", error)
      return { error: "Failed to mark notifications as read" }
    }

    return { success: "All notifications marked as read" }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { error: "An unexpected error occurred" }
  }
}
