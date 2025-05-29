"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { useUserRole } from "@/hooks/use-user-role";

export default function ManageCoursesPage() {
  const { role } = useUserRole();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [form, setForm] = useState<{ title: string; description: string; instructor: string; image_url: string }>({ title: '', description: '', instructor: '', image_url: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError("");
      let { data, error } = await supabase.from('courses').select('*');
      if (error) setError(error.message);
      else setCourses(data ?? []);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const openCreate = () => {
    setEditingCourse(null);
    setForm({ title: '', description: '', instructor: '', image_url: '' });
    setShowDialog(true);
  };
  const openEdit = (course: any) => {
    setEditingCourse(course);
    setForm({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      image_url: course.image_url || '',
    });
    setShowDialog(true);
  };
  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingCourse) {
        // Update
        const { error } = await supabase.from('courses').update(form).eq('id', editingCourse.id);
        if (error) throw new Error(error.message);
      } else {
        // Create
        const { error } = await supabase.from('courses').insert([{ ...form }]);
        if (error) throw new Error(error.message);
      }
      setShowDialog(false);
      // Refresh
      let { data, error: fetchError } = await supabase.from('courses').select('*');
      if (!fetchError) setCourses(data ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw new Error(error.message);
      setCourses(courses.filter((c: any) => c.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Management</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage all courses on the platform.
          </p>
        </div>
        {(role === 'admin' || role === 'owner') && (
          <Button onClick={openCreate}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Course
          </Button>
        )}
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCourse ? 'Edit Course' : 'Create New Course'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={form.description} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, description: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="instructor">Instructor</Label>
              <Input id="instructor" value={form.instructor} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, instructor: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input id="image_url" value={form.image_url} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, image_url: e.target.value }))} />
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
          <CardTitle>All Courses</CardTitle>
          <CardDescription>View and manage your existing courses.</CardDescription>
          <div className="pt-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search courses..." className="pl-8 w-full md:w-1/3" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading courses...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Students</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course: any) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell className="hidden md:table-cell">-</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Published</span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{course.updated_at || course.created_at?.slice(0, 10)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" aria-label="Edit Course" onClick={() => openEdit(course)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" aria-label="Delete Course" onClick={() => handleDelete(course.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
