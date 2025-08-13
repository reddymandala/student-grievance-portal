"use server"

// Dummy signOut function since authentication was removed
export async function signOut() {
  // No-op function for compatibility
  return { success: true }
}
