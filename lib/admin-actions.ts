"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Update grievance status
export async function updateGrievanceStatus(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const grievanceId = formData.get("grievanceId")
  const status = formData.get("status")
  const message = formData.get("message")

  if (!grievanceId || !status) {
    return { error: "Grievance ID and status are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    // Get the current user and verify admin role
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: "You must be logged in" }
    }

    const { data: userData, error: userDataError } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", user.id)
      .single()

    if (userDataError || !userData || userData.role !== "admin") {
      return { error: "Access denied. Admin privileges required." }
    }

    // Update the grievance status
    const { error: updateError } = await supabase
      .from("grievances")
      .update({
        status: status.toString(),
        assigned_admin_id: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", grievanceId.toString())

    if (updateError) {
      console.error("Status update error:", updateError)
      return { error: "Failed to update grievance status" }
    }

    // Add an update record if message is provided
    if (message && message.toString().trim()) {
      const { error: updateRecordError } = await supabase.from("grievance_updates").insert({
        grievance_id: grievanceId.toString(),
        admin_id: user.id,
        message: message.toString(),
        status_change: status.toString(),
        is_internal: false,
      })

      if (updateRecordError) {
        console.error("Update record error:", updateRecordError)
        // Don't return error here as the status was updated successfully
      }
    }

    return { success: "Grievance status updated successfully" }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Add admin response to grievance
export async function addGrievanceResponse(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const grievanceId = formData.get("grievanceId")
  const message = formData.get("message")
  const isInternal = formData.get("isInternal") === "true"

  if (!grievanceId || !message) {
    return { error: "Grievance ID and message are required" }
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

    const { data: userData, error: userDataError } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", user.id)
      .single()

    if (userDataError || !userData || userData.role !== "admin") {
      return { error: "Access denied. Admin privileges required." }
    }

    // Add the response
    const { error } = await supabase.from("grievance_updates").insert({
      grievance_id: grievanceId.toString(),
      admin_id: user.id,
      message: message.toString(),
      is_internal: isInternal,
    })

    if (error) {
      console.error("Response error:", error)
      return { error: "Failed to add response" }
    }

    return { success: "Response added successfully" }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Get all grievances for admin dashboard
export async function getAllGrievances() {
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

    const { data: userData, error: userDataError } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", user.id)
      .single()

    if (userDataError || !userData || userData.role !== "admin") {
      return { error: "Access denied. Admin privileges required." }
    }

    const { data, error } = await supabase
      .from("grievances")
      .select(`
        *,
        student:student_id (
          full_name,
          email,
          student_id
        ),
        assigned_admin:assigned_admin_id (
          full_name
        ),
        grievance_updates (
          id,
          message,
          status_change,
          is_internal,
          created_at,
          admin:admin_id (
            full_name
          )
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching grievances:", error)
      return { error: "Failed to fetch grievances" }
    }

    return { data }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { error: "An unexpected error occurred" }
  }
}
