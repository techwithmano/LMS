"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Quiz {
  _id: string;
  title: string;
  course: string;
}

export default function QuizManager() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [form, setForm] = useState({ title: "", course: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  async function fetchQuizzes() {
    setLoading(true);
    try {
      const res = await axios.get("/api/quizzes");
      setQuizzes(res.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("/api/quizzes", form);
      setForm({ title: "", course: "" });
      fetchQuizzes();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div>
              <Label>Course ID</Label>
              <Input value={form.course} onChange={e => setForm(f => ({ ...f, course: e.target.value }))} required />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Quiz"}</Button>
              {error && <span className="text-red-500">{error}</span>}
            </div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>All Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {quizzes.map(quiz => (
              <div key={quiz._id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-bold text-lg">{quiz.title}</div>
                  <div className="text-xs">Course: {quiz.course}</div>
                </div>
              </div>
            ))}
            {quizzes.length === 0 && <div className="text-muted-foreground">No quizzes found.</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
