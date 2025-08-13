import { GrievanceForm } from "@/components/grievance-form"

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Submit a Grievance</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Please provide detailed information about your concern. Our team will review your submission and respond
            promptly.
          </p>
        </div>

        <GrievanceForm />
      </div>
    </div>
  )
}
