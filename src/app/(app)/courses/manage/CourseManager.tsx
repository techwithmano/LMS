"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Course {
  _id: string;
  title: string;
  subject: string;
  level: string;
  image: string;
  instructor: string;
}

export default function CourseManager() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState({ title: "", subject: "", level: "", image: "", instructor: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    setLoading(true);
    try {
      const res = await axios.get("/api/courses");
      setCourses(res.data);
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
      await axios.post("/api/courses", form);
      setForm({ title: "", subject: "", level: "", image: "", instructor: "" });
      fetchCourses();
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
          <CardTitle>Create New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div>
              <Label>Subject</Label>
              <Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required />
            </div>
            <div>
              <Label>Level</Label>
              <Input value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} required />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <Label>Instructor (User ID or Name)</Label>
              <Input value={form.instructor} onChange={e => setForm(f => ({ ...f, instructor: e.target.value }))} required />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Course"}</Button>
              {error && <span className="text-red-500">{error}</span>}
            </div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {courses.map(course => (
              <div key={course._id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-bold text-lg">{course.title}</div>
                  <div className="text-sm text-muted-foreground">{course.subject} | {course.level}</div>
                  <div className="text-xs">Instructor: {course.instructor}</div>
                </div>
                {course.image && <img src={course.image} alt={course.title} className="w-24 h-16 object-cover rounded mt-2 md:mt-0" />}
              </div>
            ))}
            {courses.length === 0 && <div className="text-muted-foreground">No courses found.</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
