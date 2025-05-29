"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LessonPage({ params }: { params: { courseId: string, lessonId: string } }) {
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      setError("");
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', params.courseId)
        .eq('id', params.lessonId)
        .single();
      if (error) setError(error.message);
      else setLesson(data);
      setLoading(false);
    };
    fetchLesson();
  }, [params.courseId, params.lessonId]);

  if (loading) return <div className="text-center py-8">Loading lesson...</div>;
  if (error || !lesson) return <div className="text-center text-red-500 py-8">{error || 'Lesson not found.'}</div>;

  const nextLessonId = (parseInt(params.lessonId) + 1).toString(); // simplified logic
  const prevLessonId = (parseInt(params.lessonId) - 1).toString(); // simplified logic

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link href={`/courses/${lesson.course_id}`} passHref>
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Course
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-center flex-1 px-4 truncate">{lesson.title}</h1>
        <div>{/* Placeholder for potential actions like "Mark as complete" */}</div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          {lesson.type === "video" && lesson.video_url && (
            <div className="aspect-video mb-6">
              <iframe
                width="100%"
                height="100%"
                src={lesson.video_url}
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
          <Link href={`/courses/${lesson.course_id}/lessons/${prevLessonId}`} passHref>
            <Button variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous Lesson
            </Button>
          </Link>
        ) : <div></div>}
        <Button variant="default">
            <CheckCircle className="mr-2 h-4 w-4" /> Mark as Complete
        </Button>
        {/* This is just a sample, real app needs to check if there is a next lesson */}
        <Link href={`/courses/${lesson.course_id}/lessons/${nextLessonId}`} passHref>
          <Button variant="outline">
            Next Lesson <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
