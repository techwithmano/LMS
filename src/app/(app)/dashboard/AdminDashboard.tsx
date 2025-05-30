import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({ users: 0, courses: 0, assignments: 0, quizzes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      const usersRes = await axios.get("/api/users");
      const coursesRes = await axios.get("/api/courses");
      const assignmentsRes = await axios.get("/api/assignments");
      const quizzesRes = await axios.get("/api/quizzes");
      setStats({
        users: usersRes.data.length,
        courses: coursesRes.data.length,
        assignments: assignmentsRes.data.length,
        quizzes: quizzesRes.data.length
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Platform Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6">
            <li>Users: {stats.users}</li>
            <li>Courses: {stats.courses}</li>
            <li>Assignments: {stats.assignments}</li>
            <li>Quizzes: {stats.quizzes}</li>
          </ul>
        </CardContent>
      </Card>
      {/* Add more admin analytics and controls here */}
    </div>
  );
}
