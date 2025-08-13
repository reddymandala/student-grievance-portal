import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, AlertCircle, CheckCircle, Clock, XCircle, User } from "lucide-react"
import Link from "next/link"

interface Student {
  full_name: string
  email: string
  student_id: string
}

interface AssignedAdmin {
  full_name: string
}

interface Grievance {
  id: string
  title: string
  description: string
  category: string
  priority: string
  status: string
  created_at: string
  updated_at: string
  student: Student
  assigned_admin: AssignedAdmin | null
}

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

export default function AdminGrievanceCard({ grievance }: { grievance: Grievance }) {
  const StatusIcon = statusConfig[grievance.status as keyof typeof statusConfig]?.icon || Clock

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{grievance.title}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">{grievance.description}</CardDescription>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>
                {grievance.student.full_name} ({grievance.student.student_id})
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 ml-4">
            <Badge className={statusConfig[grievance.status as keyof typeof statusConfig]?.color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig[grievance.status as keyof typeof statusConfig]?.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(grievance.created_at).toLocaleDateString()}
            </div>
            <Badge variant="outline" className={priorityConfig[grievance.priority as keyof typeof priorityConfig]}>
              {grievance.priority.charAt(0).toUpperCase() + grievance.priority.slice(1)}
            </Badge>
            <Badge variant="outline">{categoryLabels[grievance.category as keyof typeof categoryLabels]}</Badge>
            {grievance.assigned_admin && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Assigned: {grievance.assigned_admin.full_name}
              </Badge>
            )}
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/grievances/${grievance.id}`}>Manage</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
