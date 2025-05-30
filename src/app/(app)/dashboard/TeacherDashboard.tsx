import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function TeacherDashboard({ userId }: { userId: string }) {
  const [courses, setCourses] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Fetch courses taught by this teacher
      const coursesRes = await axios.get(`/api/courses?instructor=${userId}`);
      setCourses(coursesRes.data);
      // Fetch analytics (stubbed for now)
      setAnalytics({});
      setLoading(false);
    }
    fetchData();
  }, [userId]);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6">
            {courses.map((c: any) => (
              <li key={c._id}>{c.title}</li>
            ))}
            {courses.length === 0 && <li className="text-muted-foreground">No courses found.</li>}
          </ul>
        </CardContent>
      </Card>
      {/* Analytics and student performance can be added here */}
    </div>
  );
}
