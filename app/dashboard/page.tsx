import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plus, BarChart3, Bell, LogOut } from "lucide-react"
import Link from "next/link"
import { signOut } from "@/lib/actions"
import GrievanceCard from "@/components/grievance-card"
import NotificationBell from "@/components/notification-bell"

export default async function DashboardPage() {
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

  // Get user details
  const { data: userData, error: userDataError } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (userDataError || !userData) {
    redirect("/auth/login")
  }

  // Get user's grievances
  const { data: grievances, error: grievancesError } = await supabase
    .from("grievances")
    .select("*")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false })

  const { data: notifications, error: notificationsError } = await supabase
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
    .limit(3)

  const unreadNotificationCount = notifications?.filter((n) => !n.is_read).length || 0

  // Get grievance statistics
  const stats = {
    total: grievances?.length || 0,
    submitted: grievances?.filter((g) => g.status === "submitted").length || 0,
    in_progress: grievances?.filter((g) => g.status === "in_progress" || g.status === "under_review").length || 0,
    resolved: grievances?.filter((g) => g.status === "resolved").length || 0,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {userData.full_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell unreadCount={unreadNotificationCount} />
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/dashboard/submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Grievance
                </Link>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Grievances</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submitted</CardTitle>
              <Bell className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.submitted}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.in_progress}</div>
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Grievances */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Your Grievances</h2>
                {grievances && grievances.length > 0 && (
                  <Button asChild variant="outline">
                    <Link href="/dashboard/grievances">View All</Link>
                  </Button>
                )}
              </div>

              {grievances && grievances.length > 0 ? (
                <div className="space-y-4">
                  {grievances.slice(0, 3).map((grievance) => (
                    <GrievanceCard key={grievance.id} grievance={grievance} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No Grievances Yet</CardTitle>
                    <CardDescription>
                      You haven't submitted any grievances. Click the button below to get started.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                      <Link href="/dashboard/submit">
                        <Plus className="h-4 w-4 mr-2" />
                        Submit Your First Grievance
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Recent Notifications
                  </CardTitle>
                  {notifications && notifications.length > 0 && (
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/dashboard/notifications">View All</Link>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {notifications && notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border text-sm ${
                          !notification.is_read ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{notification.title}</span>
                          {!notification.is_read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No notifications yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
