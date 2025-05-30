"use client";

import { FormEvent, useEffect, useState } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckSquare, Edit, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import QuizManager from "./QuizManager";

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
      const res = await fetch("/api/quizzes");
      if (!res.ok) setError("Failed to fetch quizzes");
      else setQuizzes(await res.json());
      setLoading(false);
    };
    fetchQuizzes();
  }, []);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!profile) return;
      let url = role === 'student' ? `/api/submissions?student_id=${profile.id}` : "/api/submissions";
      const res = await fetch(url);
      setSubmissions(res.ok ? await res.json() : []);
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
      let res;
      if (editingQuiz) {
        res = await fetch(`/api/quizzes/${editingQuiz.id}`, { method: "PUT", headers: {"Content-Type": "application/json"}, body: JSON.stringify(quizForm) });
      } else {
        res = await fetch("/api/quizzes", { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(quizForm) });
      }
      if (!res.ok) throw new Error("Failed to save quiz");
      setShowDialog(false);
      const qRes = await fetch("/api/quizzes");
      setQuizzes(qRes.ok ? await qRes.json() : []);
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
      const res = await fetch(`/api/quizzes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete quiz");
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
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quiz_id: activeQuiz.id, student_id: profile.id, answers: { content: submissionContent } })
      });
      if (!res.ok) throw new Error("Failed to submit");
      setShowSubmitDialog(false);
      setSubmissionContent('');
      const subRes = await fetch(`/api/submissions?student_id=${profile.id}`);
      setSubmissions(subRes.ok ? await subRes.json() : []);
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
      const res = await fetch(`/api/submissions/${gradingSubmission.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: Number(grade), feedback })
      });
      if (!res.ok) throw new Error("Failed to grade submission");
      setGradingDialog(false);
      const subRes = await fetch(`/api/submissions`);
      setSubmissions(subRes.ok ? await subRes.json() : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Helper: get submission for quiz/student
  const getSubmission = (quizId: string) => submissions.find((s: any) => s.quiz_id === quizId && (role !== 'student' || s.student_id === profile?.id));

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <QuizManager />
    </div>
  );
}
