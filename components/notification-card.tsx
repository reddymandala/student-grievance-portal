"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, BellRing, Calendar, FileText } from "lucide-react"
import Link from "next/link"
import { useActionState } from "react"
import { markNotificationAsRead } from "@/lib/notification-actions"

interface Grievance {
  id: string
  title: string
  status: string
}

interface Notification {
  id: string
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
  grievance: Grievance | null
}

const typeConfig = {
  grievance_submitted: { icon: FileText, color: "bg-blue-100 text-blue-800", label: "Submitted" },
  status_update: { icon: BellRing, color: "bg-orange-100 text-orange-800", label: "Status Update" },
  admin_response: { icon: Bell, color: "bg-green-100 text-green-800", label: "Response" },
  grievance_resolved: { icon: FileText, color: "bg-green-100 text-green-800", label: "Resolved" },
}

export default function NotificationCard({ notification }: { notification: Notification }) {
  const [state, formAction] = useActionState(markNotificationAsRead, null)
  const TypeIcon = typeConfig[notification.type as keyof typeof typeConfig]?.icon || Bell

  return (
    <Card
      className={`hover:shadow-md transition-shadow ${!notification.is_read ? "border-blue-200 bg-blue-50/30" : ""}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <TypeIcon className="h-4 w-4" />
              <CardTitle className="text-lg">{notification.title}</CardTitle>
              {!notification.is_read && <Badge className="bg-blue-600 text-white text-xs">New</Badge>}
            </div>
            <CardDescription className="text-sm">{notification.message}</CardDescription>
          </div>
          <Badge
            variant="outline"
            className={typeConfig[notification.type as keyof typeof typeConfig]?.color || "bg-gray-100 text-gray-800"}
          >
            {typeConfig[notification.type as keyof typeof typeConfig]?.label || "Notification"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(notification.created_at).toLocaleString()}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {notification.grievance && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/grievances/${notification.grievance.id}`}>View Grievance</Link>
              </Button>
            )}
            {!notification.is_read && (
              <form action={formAction}>
                <input type="hidden" name="notificationId" value={notification.id} />
                <Button type="submit" variant="ghost" size="sm" className="text-blue-600">
                  Mark as Read
                </Button>
              </form>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
