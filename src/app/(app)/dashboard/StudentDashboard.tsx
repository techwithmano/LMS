import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function StudentDashboard({ userId }: { userId: string }) {
  const [courses, setCourses] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>({});
  const [assignments, setAssignments] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Fetch enrolled courses
      const coursesRes = await axios.get(`/api/courses?student=${userId}`);
      setCourses(coursesRes.data);
      // Fetch assignments/quizzes for enrolled courses
      const assignmentsRes = await axios.get(`/api/assignments?student=${userId}`);
      setAssignments(assignmentsRes.data);
      const quizzesRes = await axios.get(`/api/quizzes?student=${userId}`);
      setQuizzes(quizzesRes.data);
      // Fetch progress (stubbed for now)
      setProgress({});
      setLoading(false);
    }
    fetchData();
  }, [userId]);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Enrolled Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6">
            {courses.map((c: any) => (
              <li key={c._id}>{c.title}</li>
            ))}
            {courses.length === 0 && <li className="text-muted-foreground">No courses enrolled.</li>}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Assignments & Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6">
            {assignments.map((a: any) => (
              <li key={a._id}>Assignment: {a.title} (Due: {a.dueDate?.slice(0,10)})</li>
            ))}
            {quizzes.map((q: any) => (
              <li key={q._id}>Quiz: {q.title}</li>
            ))}
            {assignments.length + quizzes.length === 0 && <li className="text-muted-foreground">No assignments or quizzes.</li>}
          </ul>
        </CardContent>
      </Card>
      {/* Progress and analytics can be added here */}
    </div>
  );
}
