"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Lesson {
  _id: string;
  title: string;
  description: string;
  resources: string[];
  videoLink: string;
  notes: string;
  course: string;
}

export default function LessonManager() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [form, setForm] = useState({ title: "", description: "", resources: "", videoLink: "", notes: "", course: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLessons();
  }, []);

  async function fetchLessons() {
    setLoading(true);
    try {
      const res = await axios.get("/api/lessons");
      setLessons(res.data);
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
      await axios.post("/api/lessons", {
        ...form,
        resources: form.resources.split(",").map(r => r.trim())
      });
      setForm({ title: "", description: "", resources: "", videoLink: "", notes: "", course: "" });
      fetchLessons();
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
          <CardTitle>Create New Lesson</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
            </div>
            <div>
              <Label>Resources (comma separated URLs)</Label>
              <Input value={form.resources} onChange={e => setForm(f => ({ ...f, resources: e.target.value }))} />
            </div>
            <div>
              <Label>Video Link</Label>
              <Input value={form.videoLink} onChange={e => setForm(f => ({ ...f, videoLink: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <Label>Notes</Label>
              <Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <Label>Course ID</Label>
              <Input value={form.course} onChange={e => setForm(f => ({ ...f, course: e.target.value }))} required />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Lesson"}</Button>
              {error && <span className="text-red-500">{error}</span>}
            </div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>All Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {lessons.map(lesson => (
              <div key={lesson._id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-bold text-lg">{lesson.title}</div>
                  <div className="text-sm text-muted-foreground">{lesson.description}</div>
                  <div className="text-xs">Course: {lesson.course}</div>
                </div>
                {lesson.videoLink && <a href={lesson.videoLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mt-2 md:mt-0">Video</a>}
              </div>
            ))}
            {lessons.length === 0 && <div className="text-muted-foreground">No lessons found.</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
