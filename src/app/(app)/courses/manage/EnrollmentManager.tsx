"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Course { _id: string; title: string; }
interface Student { _id: string; name: string; email: string; }

export default function EnrollmentManager() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [form, setForm] = useState({ course: "", student: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
    fetchStudents();
    fetchEnrollments();
  }, []);

  async function fetchCourses() {
    try {
      const res = await axios.get("/api/courses");
      setCourses(res.data);
    } catch {}
  }
  async function fetchStudents() {
    try {
      const res = await axios.get("/api/users?role=student");
      setStudents(res.data);
    } catch {}
  }
  async function fetchEnrollments() {
    try {
      const res = await axios.get("/api/enrollments");
      setEnrollments(res.data);
    } catch {}
  }

  async function handleEnroll(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("/api/enrollments", { course: form.course, student: form.student });
      setForm({ course: "", student: "" });
      fetchEnrollments();
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
          <CardTitle>Enroll Student in Course</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEnroll} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Course</Label>
              <select value={form.course} onChange={e => setForm(f => ({ ...f, course: e.target.value }))} required className="w-full border rounded p-2">
                <option value="">Select a course</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
              </select>
            </div>
            <div>
              <Label>Student</Label>
              <select value={form.student} onChange={e => setForm(f => ({ ...f, student: e.target.value }))} required className="w-full border rounded p-2">
                <option value="">Select a student</option>
                {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.email})</option>)}
              </select>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" disabled={loading}>{loading ? "Enrolling..." : "Enroll"}</Button>
              {error && <span className="text-red-500">{error}</span>}
            </div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Current Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {enrollments.map(enr => (
              <div key={enr._id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-bold">Course: {enr.course?.title || enr.course}</div>
                  <div className="text-sm">Student: {enr.student?.name || enr.student}</div>
                </div>
              </div>
            ))}
            {enrollments.length === 0 && <div className="text-muted-foreground">No enrollments found.</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
