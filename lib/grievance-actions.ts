"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Submit a new grievance (no authentication required)
export async function submitGrievance(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const studentName = formData.get("student_name")
  const studentEmail = formData.get("student_email")
  const studentId = formData.get("student_id")
  const title = formData.get("title")
  const description = formData.get("description")
  const category = formData.get("category")
  const priority = formData.get("priority") || "medium"

  if (!studentName || !studentEmail || !studentId || !title || !description || !category) {
    return { error: "All fields are required" }
  }

  const supabase = createClient()

  try {
    // Insert the grievance
    const { data, error } = await supabase
      .from("grievances")
      .insert({
        student_name: studentName.toString(),
        student_email: studentEmail.toString(),
        student_id: studentId.toString(),
        title: title.toString(),
        description: description.toString(),
        category: category.toString(),
        priority: priority.toString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Grievance submission error:", error)
      return { error: "Failed to submit grievance. Please try again." }
    }

    revalidatePath("/")
    return { success: "Grievance submitted successfully!", grievanceId: data.id }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Get all grievances
export async function getAllGrievances() {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.from("grievances").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching grievances:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error:", error)
    return []
  }
}

// Get grievance by ID
export async function getGrievanceById(id: string) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.from("grievances").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching grievance:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Unexpected error:", error)
    return null
  }
}

// Update grievance status (admin function)
export async function updateGrievanceStatus(id: string, status: string, adminResponse?: string, adminName?: string) {
  const supabase = createClient()

  try {
    const updateData: any = { status }

    if (adminResponse) {
      updateData.admin_response = adminResponse
    }

    if (adminName) {
      updateData.admin_name = adminName
    }

    const { data, error } = await supabase.from("grievances").update(updateData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating grievance:", error)
      throw new Error("Failed to update grievance")
    }

    revalidatePath("/admin")
    revalidatePath(`/admin/grievance/${id}`)
    revalidatePath("/")

    return data
  } catch (error) {
    console.error("Unexpected error:", error)
    throw new Error("An unexpected error occurred")
  }
}
