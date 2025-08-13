import { GrievanceForm } from "@/components/grievance-form"
import { GrievanceCard } from "@/components/grievance-card"
import { getAllGrievances } from "@/lib/grievance-actions"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, FileText, Users, Bell } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  let recentGrievances = []
  let hasError = false

  try {
    recentGrievances = await getAllGrievances()
  } catch (error) {
    console.error("Error loading grievances:", error)
    hasError = true
  }

  const recentFive = recentGrievances.slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Student Grievance Portal</h1>
            </div>
            <Button asChild>
              <Link href="/admin">Admin Panel</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Submit Your Grievance</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have a concern or issue? Submit your grievance below and our administration team will review and respond
            promptly.
          </p>
        </div>

        {hasError && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              <strong>Database Setup Required:</strong> Please run the SQL scripts to set up the database tables before
              using the portal.
            </p>
          </div>
        )}

        {/* Grievance Form */}
        <div className="mb-16">
          <GrievanceForm />
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Easy Submission</CardTitle>
              <CardDescription>
                Submit your concerns with detailed descriptions and proper categorization
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Admin Review</CardTitle>
              <CardDescription>Administrators review and respond to grievances in a timely manner</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Bell className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Track Progress</CardTitle>
              <CardDescription>Monitor the status of your submissions and receive updates</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Grievances */}
        {recentFive.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Recent Grievances</h3>
              <Button asChild variant="outline">
                <Link href="/all-grievances">View All</Link>
              </Button>
            </div>
            <div className="grid gap-6">
              {recentFive.map((grievance) => (
                <GrievanceCard key={grievance.id} grievance={grievance} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
