"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, MessageSquare } from "lucide-react"
import { useState } from "react"
import { addGrievanceResponse } from "@/lib/admin-actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full bg-green-600 hover:bg-green-700 text-white">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding Response...
        </>
      ) : (
        <>
          <MessageSquare className="mr-2 h-4 w-4" />
          Add Response
        </>
      )}
    </Button>
  )
}

export default function AdminResponseForm({
  grievanceId,
  onSuccess,
}: {
  grievanceId: string
  onSuccess?: () => void
}) {
  const [state, formAction] = useActionState(addGrievanceResponse, null)
  const [isInternal, setIsInternal] = useState(false)

  // Handle successful response
  if (state?.success && onSuccess) {
    onSuccess()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Add Response
        </CardTitle>
        <CardDescription>Respond to the student or add internal notes</CardDescription>
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
            <label htmlFor="message" className="block text-sm font-medium">
              Response Message
            </label>
            <Textarea
              id="message"
              name="message"
              placeholder="Type your response to the student..."
              required
              className="min-h-32"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isInternal"
              name="isInternal"
              checked={isInternal}
              onCheckedChange={(checked) => setIsInternal(checked as boolean)}
            />
            <input type="hidden" name="isInternal" value={isInternal.toString()} />
            <label
              htmlFor="isInternal"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Internal note (not visible to student)
            </label>
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  )
}
