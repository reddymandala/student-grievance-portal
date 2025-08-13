"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface NotificationBellProps {
  unreadCount: number
}

export default function NotificationBell({ unreadCount }: NotificationBellProps) {
  return (
    <Button asChild variant="ghost" size="sm" className="relative">
      <Link href="/dashboard/notifications">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Link>
    </Button>
  )
}
