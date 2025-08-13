import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"

const statusConfig = {
  submitted: { icon: Clock, color: "bg-yellow-100 text-yellow-800", label: "Submitted" },
  under_review: { icon: AlertCircle, color: "bg-blue-100 text-blue-800", label: "Under Review" },
  in_progress: { icon: Clock, color: "bg-orange-100 text-orange-800", label: "In Progress" },
  resolved: { icon: CheckCircle, color: "bg-green-100 text-green-800", label: "Resolved" },
  closed: { icon: XCircle, color: "bg-gray-100 text-gray-800", label: "Closed" },
}

const priorityConfig = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

const categoryLabels = {
  academic: "Academic",
  administrative: "Administrative",
  facilities: "Facilities",
  harassment: "Harassment",
  discrimination: "Discrimination",
  financial: "Financial",
  other: "Other",
}

export default async function GrievanceDetailPage({ params }: { params: { id: string } }) {
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

  // Get grievance details (only if user owns it)
  const { data: grievance, error: grievanceError } = await supabase
    .from("grievances")
    .select(`
      *,
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
    .eq("id", params.id)
    .eq("student_id", user.id) // Ensure student can only see their own grievances
    .single()

  if (grievanceError || !grievance) {
    notFound()
  }

  const StatusIcon = statusConfig[grievance.status as keyof typeof statusConfig]?.icon || Clock

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button asChild variant="ghost" className="mr-4">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <StatusIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Grievance Details</h1>
                <p className="text-sm text-gray-600">Track your grievance progress</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Grievance Details */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{grievance.title}</CardTitle>
                  <CardDescription className="mt-2">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Submitted: {new Date(grievance.created_at).toLocaleDateString()}
                      </div>
                      <Badge className={statusConfig[grievance.status as keyof typeof statusConfig]?.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig[grievance.status as keyof typeof statusConfig]?.label}
                      </Badge>
                    </div>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className={priorityConfig[grievance.priority as keyof typeof priorityConfig]}
                  >
                    {grievance.priority.charAt(0).toUpperCase() + grievance.priority.slice(1)}
                  </Badge>
                  <Badge variant="outline">{categoryLabels[grievance.category as keyof typeof categoryLabels]}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{grievance.description}</p>
                </div>
                {grievance.assigned_admin && (
                  <div>
                    <h4 className="font-medium mb-2">Assigned Administrator</h4>
                    <p className="text-gray-700">{grievance.assigned_admin.full_name}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Updates History */}
          <Card>
            <CardHeader>
              <CardTitle>Updates & Responses</CardTitle>
              <CardDescription>Track all updates and responses for your grievance</CardDescription>
            </CardHeader>
            <CardContent>
              {grievance.grievance_updates && grievance.grievance_updates.length > 0 ? (
                <div className="space-y-4">
                  {grievance.grievance_updates
                    .filter((update) => !update.is_internal) // Only show non-internal updates to students
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map((update) => (
                      <div key={update.id} className="p-4 rounded-lg border bg-blue-50 border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{update.admin?.full_name || "Administrator"}</span>
                            {update.status_change && (
                              <Badge variant="outline" className="text-xs">
                                Status: {update.status_change}
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">{new Date(update.created_at).toLocaleString()}</span>
                        </div>
                        <p className="text-gray-700">{update.message}</p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No updates yet. You'll be notified when there are updates to your grievance.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
