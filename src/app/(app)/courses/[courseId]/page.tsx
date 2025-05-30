"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, FileText, ChevronRight, ListChecks, PlusCircle, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUserProfile } from "@/hooks/useUserProfile";

interface Lesson {
  id: string;
  title: string;
  type: "video" | "text";
  duration?: string; // for video
  isCompleted: boolean;
}

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const { role } = useUserRole();
  const { profile } = useUserProfile();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any | null>(null);
  const [lessonForm, setLessonForm] = useState<{ title: string; type: string; content: string; video_url: string; duration: string }>({ title: '', type: 'video', content: '', video_url: '', duration: '' });
  const [saving, setSaving] = useState(false);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [enrolling, setEnrolling] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      if (role === 'student') {
        const enrollRes = await fetch(`/api/enrollments/me?course_id=${params.courseId}`);
        if (!enrollRes.ok) {
          setError("Failed to fetch enrollments");
          setLoading(false);
          return;
        }
        const enrollments = await enrollRes.json();
        if (!enrollments || enrollments.length === 0) {
          setError('You are not enrolled in this course.');
          setLoading(false);
          return;
        }
      }
      const courseRes = await fetch(`/api/courses/${params.courseId}`);
      if (!courseRes.ok) {
        setError("Failed to fetch course");
        setLoading(false);
        return;
      }
      setCourse(await courseRes.json());
      const lessonsRes = await fetch(`/api/lessons?course_id=${params.courseId}`);
      setLessons(lessonsRes.ok ? await lessonsRes.json() : []);
      setLoading(false);
    };
    fetchData();
  }, [params.courseId, role]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (role !== 'admin' && role !== 'owner') return;
      const enrollsRes = await fetch(`/api/enrollments?course_id=${params.courseId}`);
      setEnrollments(enrollsRes.ok ? await enrollsRes.json() : []);
      const studentsRes = await fetch(`/api/users?role=student`);
      setAllStudents(studentsRes.ok ? await studentsRes.json() : []);
    };
    fetchEnrollments();
  }, [params.courseId, role, showDialog]);

  useEffect(() => {
    const fetchFiles = async () => {
      const filesRes = await fetch(`/api/files?course_id=${params.courseId}`);
      setFiles(filesRes.ok ? await filesRes.json() : []);
    };
    fetchFiles();
  }, [params.courseId]);

  const openCreate = () => {
    setEditingLesson(null);
    setLessonForm({ title: '', type: 'video', content: '', video_url: '', duration: '' });
    setShowDialog(true);
  };
  const openEdit = (lesson: any) => {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title,
      type: lesson.type,
      content: lesson.content || '',
      video_url: lesson.video_url || '',
      duration: lesson.duration || '',
    });
    setShowDialog(true);
  };
  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingLesson) {
        const res = await fetch(`/api/lessons/${editingLesson.id}`, { method: "PUT", headers: {"Content-Type": "application/json"}, body: JSON.stringify(lessonForm) });
        if (!res.ok) throw new Error("Failed to update lesson");
      } else {
        const order_num = lessons.length + 1;
        const res = await fetch(`/api/lessons`, { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ ...lessonForm, course_id: params.courseId, order_num }) });
        if (!res.ok) throw new Error("Failed to create lesson");
      }
      setShowDialog(false);
      const lessonsRes = await fetch(`/api/lessons?course_id=${params.courseId}`);
      setLessons(lessonsRes.ok ? await lessonsRes.json() : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/lessons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete lesson");
      setLessons(lessons.filter((l: any) => l.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };
  const handleEnroll = async () => {
    if (!selectedStudent) return;
    setEnrolling(true);
    setError("");
    try {
      const res = await fetch(`/api/enrollments`, { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ course_id: params.courseId, student_id: selectedStudent }) });
      if (!res.ok) throw new Error("Failed to enroll student");
      setSelectedStudent("");
      const enrollsRes = await fetch(`/api/enrollments?course_id=${params.courseId}`);
      setEnrollments(enrollsRes.ok ? await enrollsRes.json() : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setEnrolling(false);
    }
  };
  const handleUnenroll = async (enrollmentId: string) => {
    if (!confirm('Are you sure you want to remove this enrollment?')) return;
    setEnrolling(true);
    setError("");
    try {
      const res = await fetch(`/api/enrollments/${enrollmentId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove enrollment");
      const enrollsRes = await fetch(`/api/enrollments?course_id=${params.courseId}`);
      setEnrollments(enrollsRes.ok ? await enrollsRes.json() : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setEnrolling(false);
    }
  };
  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setFileError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("course_id", params.courseId);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to upload file");
      const filesRes = await fetch(`/api/files?course_id=${params.courseId}`);
      setFiles(filesRes.ok ? await filesRes.json() : []);
    } catch (err: any) {
      setFileError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading course...</div>;
  if (error) return (<div className="text-center text-red-500 py-8">{error}</div>);

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
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>Browse through the lessons and start learning.</CardDescription>
              </div>
              {(role === 'admin' || role === 'owner') && (
                <Button onClick={openCreate} size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Lesson
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {lessons.map(lesson => (
                  <li key={lesson.id} className="flex items-center justify-between group">
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
                          {/* Completion icon logic can go here */}
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </Button>
                    </Link>
                    {(role === 'admin' || role === 'owner') && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="icon" aria-label="Edit Lesson" onClick={() => openEdit(lesson)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" aria-label="Delete Lesson" onClick={() => handleDelete(lesson.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
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
                  {lessons.length} Lessons
                </div>
                <p className="text-muted-foreground">Total Lessons</p>
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
          {(role === 'admin' || role === 'owner') && (
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Students</CardTitle>
                <CardDescription>Manage which students are assigned to this course.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEnroll} className="flex gap-2 mb-4">
                  <select className="border rounded-md p-2 flex-1" value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} required>
                    <option value="">Select student to enroll...</option>
                    {allStudents.filter(s => !enrollments.some(e => e.student_id === s.id)).map(s => (
                      <option key={s.id} value={s.id}>{s.full_name || s.email}</option>
                    ))}
                  </select>
                  <Button type="submit" disabled={enrolling || !selectedStudent}>{enrolling ? 'Enrolling...' : 'Enroll'}</Button>
                </form>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollments.map(e => (
                      <TableRow key={e.id}>
                        <TableCell>{e.profiles?.full_name || e.profiles?.email}</TableCell>
                        <TableCell>{e.profiles?.email}</TableCell>
                        <TableCell>
                          <Button variant="destructive" size="sm" onClick={() => handleUnenroll(e.id)}>Remove</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLesson ? 'Edit Lesson' : 'Create New Lesson'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={lessonForm.title} onChange={(e: ChangeEvent<HTMLInputElement>) => setLessonForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <select id="type" className="w-full border rounded-md p-2" value={lessonForm.type} onChange={e => setLessonForm(f => ({ ...f, type: e.target.value }))}>
                <option value="video">Video</option>
                <option value="text">Text</option>
              </select>
            </div>
            {lessonForm.type === 'video' && (
              <>
                <div>
                  <Label htmlFor="video_url">Video URL</Label>
                  <Input id="video_url" value={lessonForm.video_url} onChange={(e: ChangeEvent<HTMLInputElement>) => setLessonForm(f => ({ ...f, video_url: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" value={lessonForm.duration} onChange={(e: ChangeEvent<HTMLInputElement>) => setLessonForm(f => ({ ...f, duration: e.target.value }))} />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="content">Content</Label>
              <textarea id="content" className="w-full border rounded-md p-2 min-h-[100px]" value={lessonForm.content} onChange={e => setLessonForm(f => ({ ...f, content: e.target.value }))} />
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <DialogFooter>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Resources & Files</CardTitle>
        </CardHeader>
        <CardContent>
          {(role === 'admin' || role === 'owner' || role === 'student') && (
            <div className="mb-4">
              <input type="file" onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }} disabled={uploading} />
              {fileError && <div className="text-red-600 text-sm mt-1">{fileError}</div>}
            </div>
          )}
          <ul className="space-y-2 text-sm">
            {files.map(f => (
              <li key={f.id} className="flex items-center gap-2">
                <a href={f.file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{f.file_name}</a>
                <span className="text-xs text-muted-foreground">{f.file_type}</span>
                <span className="text-xs text-muted-foreground">{f.uploaded_at?.slice(0,10) || ''}</span>
              </li>
            ))}
            {files.length === 0 && <li className="text-muted-foreground">No files uploaded yet.</li>}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
