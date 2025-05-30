"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  pdfUrl: string;
  submissionUrl: string;
  course: string;
  dueDate: string;
}

export default function AssignmentManager() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [form, setForm] = useState({ title: "", description: "", pdfUrl: "", submissionUrl: "", course: "", dueDate: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAssignments();
  }, []);

  async function fetchAssignments() {
    setLoading(true);
    try {
      const res = await axios.get("/api/assignments");
      setAssignments(res.data);
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
      await axios.post("/api/assignments", form);
      setForm({ title: "", description: "", pdfUrl: "", submissionUrl: "", course: "", dueDate: "" });
      fetchAssignments();
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
          <CardTitle>Create New Assignment</CardTitle>
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
              <Label>PDF Link</Label>
              <Input value={form.pdfUrl} onChange={e => setForm(f => ({ ...f, pdfUrl: e.target.value }))} />
            </div>
            <div>
              <Label>Submission Form Link</Label>
              <Input value={form.submissionUrl} onChange={e => setForm(f => ({ ...f, submissionUrl: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <Label>Course ID</Label>
              <Input value={form.course} onChange={e => setForm(f => ({ ...f, course: e.target.value }))} required />
            </div>
            <div className="md:col-span-2">
              <Label>Due Date</Label>
              <Input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Assignment"}</Button>
              {error && <span className="text-red-500">{error}</span>}
            </div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {assignments.map(assignment => (
              <div key={assignment._id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-bold text-lg">{assignment.title}</div>
                  <div className="text-sm text-muted-foreground">{assignment.description}</div>
                  <div className="text-xs">Course: {assignment.course}</div>
                  <div className="text-xs">Due: {assignment.dueDate?.slice(0,10)}</div>
                </div>
                {assignment.pdfUrl && <a href={assignment.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mt-2 md:mt-0">PDF</a>}
                {assignment.submissionUrl && <a href={assignment.submissionUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 underline mt-2 md:mt-0">Submit</a>}
              </div>
            ))}
            {assignments.length === 0 && <div className="text-muted-foreground">No assignments found.</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
