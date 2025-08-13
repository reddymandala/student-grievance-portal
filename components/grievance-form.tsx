"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, FileText } from "lucide-react"
import { useState } from "react"
import { submitGrievance } from "@/lib/grievance-actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4" />
          Submit Grievance
        </>
      )}
    </Button>
  )
}

export function GrievanceForm({ onSuccess }: { onSuccess?: () => void }) {
  const [state, formAction] = useActionState(submitGrievance, null)
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("medium")

  // Handle successful submission
  if (state?.success && onSuccess) {
    onSuccess()
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Submit New Grievance
        </CardTitle>
        <CardDescription>Describe your concern in detail so we can assist you effectively</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{state.error}</div>
          )}

          {state?.success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{state.success}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="student_name" className="block text-sm font-medium">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="student_name"
                name="student_name"
                type="text"
                placeholder="Enter your full name"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="student_email" className="block text-sm font-medium">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                id="student_email"
                name="student_email"
                type="email"
                placeholder="Enter your email address"
                required
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="student_id" className="block text-sm font-medium">
              Student ID <span className="text-red-500">*</span>
            </label>
            <Input
              id="student_id"
              name="student_id"
              type="text"
              placeholder="Enter your student ID"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Brief summary of your grievance"
              required
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium">
                Category <span className="text-red-500">*</span>
              </label>
              <Select name="category" value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Administrative">Administrative</SelectItem>
                  <SelectItem value="Facilities">Facilities</SelectItem>
                  <SelectItem value="Harassment">Harassment</SelectItem>
                  <SelectItem value="Discrimination">Discrimination</SelectItem>
                  <SelectItem value="Financial">Financial</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="priority" className="block text-sm font-medium">
                Priority
              </label>
              <Select name="priority" value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Please provide a detailed description of your grievance, including any relevant dates, names, and circumstances..."
              required
              className="min-h-32 w-full"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Before submitting:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Ensure all information is accurate and complete</li>
              <li>• Include specific details, dates, and any supporting information</li>
              <li>• Your grievance will be reviewed by our administration team</li>
              <li>• You can check the status of your submission on this page</li>
            </ul>
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  )
}

export default GrievanceForm
