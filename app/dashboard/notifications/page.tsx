import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Bell, CheckCheck } from "lucide-react"
import Link from "next/link"
import NotificationCard from "@/components/notification-card"
import { markAllNotificationsAsRead } from "@/lib/notification-actions"

export default async function NotificationsPage() {
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

  // Get user's notifications
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

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Button asChild variant="ghost" className="mr-4">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <Bell className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                  <p className="text-sm text-gray-600">Stay updated on your grievances</p>
                </div>
              </div>
            </div>
            {unreadCount > 0 && (
              <form action={markAllNotificationsAsRead}>
                <Button type="submit" variant="outline">
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark All as Read
                </Button>
              </form>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notifications && notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Notifications</CardTitle>
              <CardDescription>
                You don't have any notifications yet. You'll receive updates here when there are changes to your
                grievances.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/dashboard/submit">Submit Your First Grievance</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
