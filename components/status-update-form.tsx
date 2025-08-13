"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, RefreshCw } from "lucide-react"
import { useState } from "react"
import { updateGrievanceStatus } from "@/lib/admin-actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Updating...
        </>
      ) : (
        <>
          <RefreshCw className="mr-2 h-4 w-4" />
          Update Status
        </>
      )}
    </Button>
  )
}

export default function StatusUpdateForm({
  grievanceId,
  currentStatus,
  onSuccess,
}: {
  grievanceId: string
  currentStatus: string
  onSuccess?: () => void
}) {
  const [state, formAction] = useActionState(updateGrievanceStatus, null)
  const [status, setStatus] = useState(currentStatus)

  // Handle successful update
  if (state?.success && onSuccess) {
    onSuccess()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Update Status
        </CardTitle>
        <CardDescription>Change the grievance status and add a message for the student</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="grievanceId" value={grievanceId} />

          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{state.error}</div>
          )}

          {state?.success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{state.success}</div>
          )}

          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium">
              New Status
            </label>
            <Select name="status" value={status} onValueChange={setStatus} required>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
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
            <label htmlFor="message" className="block text-sm font-medium">
              Message to Student (Optional)
            </label>
            <Textarea
              id="message"
              name="message"
              placeholder="Add a message to inform the student about this status change..."
              className="min-h-24"
            />
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  )
}
