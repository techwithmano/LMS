import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, FileText, ChevronRight, ListChecks } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  type: "video" | "text";
  duration?: string; // for video
  isCompleted: boolean;
}

const sampleLessons: Lesson[] = [
  { id: "1", title: "Introduction to the Course", type: "video", duration: "10:32", isCompleted: true },
  { id: "2", title: "Setting up Your Environment", type: "text", isCompleted: true },
  { id: "3", title: "Core Concepts - Part 1", type: "video", duration: "25:15", isCompleted: false },
  { id: "4", title: "Practical Exercise", type: "text", isCompleted: false },
];

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  // In a real app, fetch course data based on params.courseId
  const course = {
    id: params.courseId,
    title: "Introduction to Next.js",
    description: "Learn the fundamentals of Next.js, React, and modern web development. This course covers everything from basic setup to advanced deployment strategies.",
    instructor: "Jane Doe",
    imageUrl: "https://placehold.co/1200x400.png",
    imageHint: "programming abstract",
    lessons: sampleLessons,
  };

  return (
    <div className="space-y-6">
      <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
        <Image 
          src={course.imageUrl} 
          alt={course.title} 
          fill 
          className="object-cover"
          data-ai-hint={course.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{course.title}</h1>
          <p className="text-lg text-gray-200">By {course.instructor}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About this course</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{course.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>Browse through the lessons and start learning.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {course.lessons.map(lesson => (
                  <li key={lesson.id}>
                    <Link href={`/courses/${course.id}/lessons/${lesson.id}`} passHref>
                      <Button variant="ghost" className="w-full justify-between h-auto py-3 px-4">
                        <div className="flex items-center gap-3 text-left">
                          {lesson.type === 'video' ? <PlayCircle className="h-5 w-5 text-primary" /> : <FileText className="h-5 w-5 text-primary" />}
                          <div>
                            <p className="font-medium">{lesson.title}</p>
                            {lesson.duration && <p className="text-xs text-muted-foreground">{lesson.duration}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           {lesson.isCompleted && <ListChecks className="h-5 w-5 text-green-500" />}
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <div className="text-4xl font-bold text-primary">
                    {Math.round(course.lessons.filter(l => l.isCompleted).length / course.lessons.length * 100)}%
                </div>
                <p className="text-muted-foreground">Completed</p>
                <Button className="mt-4 w-full">Continue Learning</Button>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-primary hover:underline">Download Slides (PDF)</Link></li>
                <li><Link href="#" className="text-primary hover:underline">Source Code (GitHub)</Link></li>
                <li><Link href="#" className="text-primary hover:underline">Community Forum</Link></li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
