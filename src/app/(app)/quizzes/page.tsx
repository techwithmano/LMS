"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUserRole } from "@/hooks/use-user-role";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckSquare, Edit, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";

export default function QuizzesPage() {
  const { role } = useUserRole();
  const { profile } = useUserProfile();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any | null>(null);
  const [quizForm, setQuizForm] = useState({ title: '', description: '', type: 'Quiz', due_date: '', total_points: 100 });
  const [saving, setSaving] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<any | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [gradingDialog, setGradingDialog] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState<any | null>(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError("");
      let { data, error } = await supabase.from('quizzes').select('*');
      if (error) setError(error.message);
      else setQuizzes(data ?? []);
      setLoading(false);
    };
    fetchQuizzes();
  }, []);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!profile) return;
      if (role === 'student') {
        const { data } = await supabase.from('submissions').select('*').eq('student_id', profile.id);
        setSubmissions(data ?? []);
      } else {
        const { data } = await supabase.from('submissions').select('*');
        setSubmissions(data ?? []);
      }
    };
    fetchSubmissions();
  }, [profile, role]);

  const openCreate = () => {
    setEditingQuiz(null);
    setQuizForm({ title: '', description: '', type: 'Quiz', due_date: '', total_points: 100 });
    setShowDialog(true);
  };
  const openEdit = (quiz: any) => {
    setEditingQuiz(quiz);
    setQuizForm({
      title: quiz.title,
      description: quiz.description || '',
      type: quiz.type,
      due_date: quiz.due_date || '',
      total_points: quiz.total_points || 100,
    });
    setShowDialog(true);
  };
  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingQuiz) {
        const { error } = await supabase.from('quizzes').update(quizForm).eq('id', editingQuiz.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from('quizzes').insert([{ ...quizForm }]);
        if (error) throw new Error(error.message);
      }
      setShowDialog(false);
      const { data, error: fetchError } = await supabase.from('quizzes').select('*');
      if (!fetchError) setQuizzes(data ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quiz/assignment?')) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('quizzes').delete().eq('id', id);
      if (error) throw new Error(error.message);
      setQuizzes(quizzes.filter((q: any) => q.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };
  // Student: submit quiz/assignment
  const openSubmit = (quiz: any) => {
    setActiveQuiz(quiz);
    setSubmissionContent('');
    setShowSubmitDialog(true);
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError("");
    try {
      const { error } = await supabase.from('submissions').insert([
        { quiz_id: activeQuiz.id, student_id: profile.id, answers: { content: submissionContent } }
      ]);
      if (error) throw new Error(error.message);
      setShowSubmitDialog(false);
      setSubmissionContent('');
      // Refresh submissions
      const { data } = await supabase.from('submissions').select('*').eq('student_id', profile.id);
      setSubmissions(data ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Admin/Owner: grade submission
  const openGrade = (submission: any) => {
    setGradingSubmission(submission);
    setGrade(submission.score || '');
    setFeedback(submission.feedback || '');
    setGradingDialog(true);
  };
  const handleGrade = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const { error } = await supabase.from('submissions').update({ score: Number(grade), feedback }).eq('id', gradingSubmission.id);
      if (error) throw new Error(error.message);
      setGradingDialog(false);
      // Refresh submissions
      const { data } = await supabase.from('submissions').select('*');
      setSubmissions(data ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Helper: get submission for quiz/student
  const getSubmission = (quizId: string) => submissions.find((s: any) => s.quiz_id === quizId && (role !== 'student' || s.student_id === profile?.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quizzes & Assignments</h1>
          <p className="text-muted-foreground">
            View your upcoming and past quizzes and assignments. Submit your work and check your grades.
          </p>
        </div>
        {(role === 'admin' || role === 'owner') && (
          <Button onClick={openCreate}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New
          </Button>
        )}
      </div>
      {error && <div className="text-red-600 text-sm text-center">{error}</div>}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map(item => {
          const submission = getSubmission(item.id);
          return (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle>{item.title}</CardTitle>
                  {item.type === "Quiz" ? <FileText className="h-5 w-5 text-primary" /> : <Edit className="h-5 w-5 text-primary" />}
                </div>
                <CardDescription>Type: {item.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Due Date: {item.due_date}</p>
                <p className="text-sm">Total Points: {item.total_points}</p>
                {role === 'student' && (
                  <div className="mt-4">
                    {!submission && <Button className="w-full" onClick={() => openSubmit(item)}>{item.type === "Quiz" ? "Start Quiz" : "Submit Assignment"}</Button>}
                    {submission && (
                      <div className="space-y-2">
                        <div className="text-sm">Status: <span className={`font-semibold ${submission.score ? "text-green-600" : "text-blue-600"}`}>{submission.score ? "Graded" : "Submitted"}</span></div>
                        {submission.score && <div className="text-sm font-semibold">Score: {submission.score}</div>}
                        {submission.feedback && <div className="text-sm">Feedback: {submission.feedback}</div>}
                        <Button variant="outline" className="w-full" disabled>View Submission</Button>
                      </div>
                    )}
                  </div>
                )}
                {(role === 'admin' || role === 'owner') && (
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="icon" aria-label="Edit" onClick={() => openEdit(item)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="destructive" size="icon" aria-label="Delete" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                )}
                {(role === 'admin' || role === 'owner') && (
                  <div className="mt-4">
                    <div className="font-semibold mb-2">Submissions:</div>
                    {submissions.filter((s: any) => s.quiz_id === item.id).length === 0 && <div className="text-sm text-muted-foreground">No submissions yet.</div>}
                    {submissions.filter((s: any) => s.quiz_id === item.id).map((s: any) => (
                      <div key={s.id} className="flex items-center justify-between border rounded p-2 mb-2">
                        <div>
                          <div className="text-sm">Student: {s.student_id}</div>
                          <div className="text-xs text-muted-foreground">Submitted: {s.submitted_at?.slice(0,10) || ''}</div>
                          <div className="text-xs">Score: {s.score ?? 'Ungraded'}</div>
                        </div>
                        <Button size="sm" onClick={() => openGrade(s)}>Grade</Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      {/* Quiz/Assignment Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingQuiz ? 'Edit Quiz/Assignment' : 'Create New Quiz/Assignment'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={quizForm.title} onChange={e => setQuizForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={quizForm.description} onChange={e => setQuizForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <select id="type" className="w-full border rounded-md p-2" value={quizForm.type} onChange={e => setQuizForm(f => ({ ...f, type: e.target.value }))}>
                <option value="Quiz">Quiz</option>
                <option value="Assignment">Assignment</option>
              </select>
            </div>
            <div>
              <Label htmlFor="due_date">Due Date</Label>
              <Input id="due_date" type="date" value={quizForm.due_date} onChange={e => setQuizForm(f => ({ ...f, due_date: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="total_points">Total Points</Label>
              <Input id="total_points" type="number" value={quizForm.total_points} onChange={e => setQuizForm(f => ({ ...f, total_points: Number(e.target.value) }))} />
            </div>
            <div>
              <Label htmlFor="pdf_link">PDF Link</Label>
              <Input id="pdf_link" type="url" value={quizForm.pdf_link} onChange={e => setQuizForm(f => ({ ...f, pdf_link: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="submission_link">Submission Form Link</Label>
              <Input id="submission_link" type="url" value={quizForm.submission_link} onChange={e => setQuizForm(f => ({ ...f, submission_link: e.target.value }))} />
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <DialogFooter>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Student Submission Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit {activeQuiz?.type}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="submission">Your Answer</Label>
              <textarea id="submission" className="w-full border rounded-md p-2 min-h-[100px]" value={submissionContent} onChange={e => setSubmissionContent(e.target.value)} required />
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <DialogFooter>
              <Button type="submit" disabled={saving}>{saving ? 'Submitting...' : 'Submit'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Grading Dialog */}
      <Dialog open={gradingDialog} onOpenChange={setGradingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grade Submission</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleGrade} className="space-y-4">
            <div>
              <Label htmlFor="grade">Score</Label>
              <Input id="grade" type="number" value={grade} onChange={e => setGrade(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="feedback">Feedback</Label>
              <textarea id="feedback" className="w-full border rounded-md p-2 min-h-[60px]" value={feedback} onChange={e => setFeedback(e.target.value)} />
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <DialogFooter>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Grade'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
