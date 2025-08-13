import { getGrievanceById, updateGrievanceStatus } from "@/lib/grievance-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, User, Mail, Hash } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

const statusColors = {
  submitted: "bg-blue-100 text-blue-800",
  under_review: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-orange-100 text-orange-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

async function handleStatusUpdate(formData: FormData) {
  "use server"

  const id = formData.get("id") as string
  const status = formData.get("status") as string
  const adminResponse = formData.get("admin_response") as string
  const adminName = formData.get("admin_name") as string

  await updateGrievanceStatus(id, status, adminResponse || undefined, adminName || undefined)
  redirect(`/admin/grievance/${id}`)
}

export default async function AdminGrievanceDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const grievance = await getGrievanceById(params.id)

  if (!grievance) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Manage Grievance</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Grievance Details */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{grievance.title}</CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Hash className="h-4 w-4" />
                      {grievance.id.slice(0, 8)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(grievance.created_at).toLocaleDateString()}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={statusColors[grievance.status]}>{grievance.status.replace("_", " ")}</Badge>
                  <Badge className={priorityColors[grievance.priority]}>{grievance.priority}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Student:</span>
                  <span>{grievance.student_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Email:</span>
                  <span>{grievance.student_email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Student ID:</span>
                  <span>{grievance.student_id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Category:</span>
                  <Badge variant="outline">{grievance.category}</Badge>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{grievance.description}</p>
              </div>

              {grievance.admin_response && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Current Admin Response</h3>
                  <p className="text-muted-foreground mb-2">{grievance.admin_response}</p>
                  {grievance.admin_name && <p className="text-sm text-muted-foreground">- {grievance.admin_name}</p>}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Admin Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Update Grievance</CardTitle>
              <CardDescription>Update the status and provide a response to the student</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleStatusUpdate} className="space-y-4">
                <input type="hidden" name="id" value={grievance.id} />

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={grievance.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin_name">Admin Name</Label>
                  <Input
                    id="admin_name"
                    name="admin_name"
                    placeholder="Enter your name"
                    defaultValue={grievance.admin_name || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin_response">Response to Student</Label>
                  <Textarea
                    id="admin_response"
                    name="admin_response"
                    placeholder="Provide a response or update to the student..."
                    className="min-h-32"
                    defaultValue={grievance.admin_response || ""}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Update Grievance
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
