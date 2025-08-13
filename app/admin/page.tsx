import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Users, BarChart3, AlertTriangle, LogOut } from "lucide-react"
import Link from "next/link"
import { signOut } from "@/lib/actions"
import AdminGrievanceCard from "@/components/admin-grievance-card"

export default async function AdminDashboardPage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Connect Supabase to get started</h1>
      </div>
    )
  }

  const supabase = createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  // Get user details and verify admin role
  const { data: userData, error: userDataError } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (userDataError || !userData || userData.role !== "admin") {
    redirect("/dashboard")
  }

  // Get all grievances with student details
  const { data: grievances, error: grievancesError } = await supabase
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
      )
    `)
    .order("created_at", { ascending: false })

  // Calculate statistics
  const stats = {
    total: grievances?.length || 0,
    submitted: grievances?.filter((g) => g.status === "submitted").length || 0,
    under_review: grievances?.filter((g) => g.status === "under_review").length || 0,
    in_progress: grievances?.filter((g) => g.status === "in_progress").length || 0,
    resolved: grievances?.filter((g) => g.status === "resolved").length || 0,
    urgent: grievances?.filter((g) => g.priority === "urgent").length || 0,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage student grievances</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="outline">
                <Link href="/admin/grievances">View All Grievances</Link>
              </Button>
              <form action={signOut}>
                <Button type="submit" variant="outline">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submitted</CardTitle>
              <BarChart3 className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.submitted}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.under_review}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.in_progress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Grievances */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Grievances</h2>
            {grievances && grievances.length > 0 && (
              <Button asChild variant="outline">
                <Link href="/admin/grievances">View All</Link>
              </Button>
            )}
          </div>

          {grievances && grievances.length > 0 ? (
            <div className="space-y-4">
              {grievances.slice(0, 5).map((grievance) => (
                <AdminGrievanceCard key={grievance.id} grievance={grievance} />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Grievances</CardTitle>
                <CardDescription>No grievances have been submitted yet.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
