import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function LessonPage({ params }: { params: { courseId: string, lessonId: string } }) {
  // In a real app, fetch lesson data based on params.courseId and params.lessonId
  const lesson = {
    id: params.lessonId,
    courseId: params.courseId,
    title: "Core Concepts - Part 1",
    type: "video", // or "text"
    content: `
      <p>This lesson covers the core concepts of our topic. We will explore the fundamental building blocks and understand how they interact.</p>
      <p>Key takeaways from this lesson:</p>
      <ul>
        <li>Understanding of Concept A</li>
        <li>Introduction to Concept B</li>
        <li>Practical application of Concept C</li>
      </ul>
      <p>Make sure to review the supplementary materials and complete the quiz at the end of this module.</p>
    `,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Example video
  };

  const nextLessonId = (parseInt(params.lessonId) + 1).toString(); // simplified logic
  const prevLessonId = (parseInt(params.lessonId) - 1).toString(); // simplified logic

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link href={`/courses/${lesson.courseId}`} passHref>
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Course
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-center flex-1 px-4 truncate">{lesson.title}</h1>
        <div>{/* Placeholder for potential actions like "Mark as complete" */}</div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          {lesson.type === "video" && lesson.videoUrl && (
            <div className="aspect-video mb-6">
              <iframe
                width="100%"
                height="100%"
                src={lesson.videoUrl}
                title="Lesson Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-md"
              ></iframe>
            </div>
          )}
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content }} />
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        {parseInt(params.lessonId) > 1 ? (
          <Link href={`/courses/${lesson.courseId}/lessons/${prevLessonId}`} passHref>
            <Button variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous Lesson
            </Button>
          </Link>
        ) : <div></div>}
        <Button variant="default">
            <CheckCircle className="mr-2 h-4 w-4" /> Mark as Complete
        </Button>
        {/* This is just a sample, real app needs to check if there is a next lesson */}
        <Link href={`/courses/${lesson.courseId}/lessons/${nextLessonId}`} passHref>
          <Button variant="outline">
            Next Lesson <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
