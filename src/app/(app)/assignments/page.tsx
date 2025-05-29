"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserRole } from "@/hooks/use-user-role"

export default function AssignmentsPage() {
  const { role } = useUserRole();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Assignments</h1>
        <p className="text-gray-500">
          {role === 'student' ? 'View and submit your assignments' : 'Manage course assignments'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Pending Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {role === 'student' 
                ? 'You have no pending assignments'
                : 'No assignments need review'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {role === 'student'
                ? 'You have no recent submissions'
                : 'No recent submissions to review'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No upcoming deadlines
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 