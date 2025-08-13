import { getAllGrievances } from "@/lib/grievance-actions"
import { GrievanceCard } from "@/components/grievance-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function AdminAllGrievancesPage() {
  const grievances = await getAllGrievances()

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
          <h1 className="text-3xl font-bold text-gray-900">All Grievances (Admin View)</h1>
        </div>

        {grievances.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No grievances have been submitted yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {grievances.map((grievance) => (
              <GrievanceCard key={grievance.id} grievance={grievance} showAdminActions />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
