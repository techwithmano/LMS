"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUserRole } from "@/hooks/use-user-role";

export default function CoursesPage() {
  const { role } = useUserRole();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError("");
      let data = [];
      let error = null;
      if (role === 'student') {
        const enrollRes = await fetch("/api/enrollments/me");
        if (!enrollRes.ok) {
          setError("Failed to fetch enrollments");
          setLoading(false);
          return;
        }
        const enrollments = await enrollRes.json();
        const courseIds = enrollments.map((e: any) => e.course_id) || [];
        if (courseIds.length === 0) {
          setCourses([]);
          setLoading(false);
          return;
        }
        const courseRes = await fetch(`/api/courses?ids=${courseIds.join(",")}`);
        data = courseRes.ok ? await courseRes.json() : [];
        error = courseRes.ok ? null : { message: "Failed to fetch courses" };
      } else {
        const courseRes = await fetch("/api/courses");
        data = courseRes.ok ? await courseRes.json() : [];
        error = courseRes.ok ? null : { message: "Failed to fetch courses" };
      }
      if (error) setError(error.message);
      else setCourses(data ?? []);
      setLoading(false);
    };
    fetchCourses();
  }, [role]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
      <p className="text-muted-foreground">
        Here are the courses you are currently enrolled in. Click on a course to view its content and track your progress.
      </p>
      {loading ? (
        <div className="text-center py-8">Loading courses...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => (
            <Card key={course.id} className="flex flex-col">
              <CardHeader>
                <div className="aspect-[16/9] relative mb-4">
                  {course.image_url && (
                    <Image 
                      src={course.image_url} 
                      alt={course.title} 
                      fill
                      className="rounded-md object-cover"
                      data-ai-hint={course.image_hint}
                    />
                  )}
                </div>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>By {course.instructor}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
              </CardContent>
              <div className="p-6 pt-0">
                <Link href={`/courses/${course.id}`} passHref>
                  <Button className="w-full">View Course</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
