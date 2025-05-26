import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  progress: number; // 0-100
  imageUrl: string;
  imageHint: string;
}

const sampleCourses: Course[] = [
  { id: "1", title: "Introduction to Next.js", description: "Learn the fundamentals of Next.js and server-side rendering.", instructor: "Jane Doe", progress: 75, imageUrl: "https://placehold.co/600x400.png", imageHint: "programming code" },
  { id: "2", title: "Advanced TypeScript", description: "Master TypeScript with advanced concepts and patterns.", instructor: "John Smith", progress: 40, imageUrl: "https://placehold.co/600x400.png", imageHint: "typescript logo" },
  { id: "3", title: "UI/UX Design Principles", description: "Explore the core principles of effective UI/UX design.", instructor: "Alice Green", progress: 90, imageUrl: "https://placehold.co/600x400.png", imageHint: "design interface" },
];

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
      <p className="text-muted-foreground">
        Here are the courses you are currently enrolled in. Click on a course to view its content and track your progress.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sampleCourses.map(course => (
          <Card key={course.id} className="flex flex-col">
            <CardHeader>
              <div className="aspect-[16/9] relative mb-4">
                <Image 
                  src={course.imageUrl} 
                  alt={course.title} 
                  fill
                  className="rounded-md object-cover"
                  data-ai-hint={course.imageHint}
                />
              </div>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>By {course.instructor}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
              <div className="mb-2">
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                </div>
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Link href={`/courses/${course.id}`} passHref>
                <Button className="w-full">View Course</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
