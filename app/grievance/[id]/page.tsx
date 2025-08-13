import { getGrievanceById } from "@/lib/grievance-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User, Mail, Hash } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

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

export default async function GrievanceDetailPage({
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
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Grievance Details</h1>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{grievance.title}</CardTitle>
                <CardDescription className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Hash className="h-4 w-4" />
                    {grievance.id}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Submitted: {new Date(grievance.created_at).toLocaleDateString()}
                  </span>
                  {grievance.updated_at !== grievance.created_at && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Updated: {new Date(grievance.updated_at).toLocaleDateString()}
                    </span>
                  )}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge className={statusColors[grievance.status]}>{grievance.status.replace("_", " ")}</Badge>
                <Badge className={priorityColors[grievance.priority]}>{grievance.priority}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <h3 className="font-semibold mb-2">Admin Response</h3>
                <p className="text-muted-foreground mb-2">{grievance.admin_response}</p>
                {grievance.admin_name && <p className="text-sm text-muted-foreground">- {grievance.admin_name}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
