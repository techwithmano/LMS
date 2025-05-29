import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUserRole } from "@/hooks/use-user-role";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Megaphone, PlusCircle, Filter, Trash2, Edit as EditIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  tags?: string[];
}

export default function AnnouncementsPage() {
  const { role } = useUserRole();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any | null>(null);
  const [form, setForm] = useState({ title: '', content: '', tags: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      setError("");
      let { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
      if (error) setError(error.message);
      else setAnnouncements(data ?? []);
      setLoading(false);
    };
    fetchAnnouncements();
  }, []);

  const openCreate = () => {
    setEditingAnnouncement(null);
    setForm({ title: '', content: '', tags: '' });
    setShowDialog(true);
  };
  const openEdit = (a: any) => {
    setEditingAnnouncement(a);
    setForm({
      title: a.title,
      content: a.content,
      tags: (a.tags || []).join(', '),
    });
    setShowDialog(true);
  };
  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const tagsArr = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      if (editingAnnouncement) {
        const { error } = await supabase.from('announcements').update({ ...form, tags: tagsArr }).eq('id', editingAnnouncement.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from('announcements').insert([{ ...form, tags: tagsArr }]);
        if (error) throw new Error(error.message);
      }
      setShowDialog(false);
      const { data, error: fetchError } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
      if (!fetchError) setAnnouncements(data ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) throw new Error(error.message);
      setAnnouncements(announcements.filter((a: any) => a.id !== id));
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
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">
            Stay updated with the latest news, updates, and important information.
          </p>
        </div>
        {(role === 'admin' || role === 'owner') && (
          <Button onClick={openCreate}>
            <PlusCircle className="mr-2 h-4 w-4" /> New Announcement
          </Button>
        )}
      </div>
      {error && <div className="text-red-600 text-sm text-center">{error}</div>}
      <Card>
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-6">
              {announcements.map(announcement => (
                <Card key={announcement.id} className="shadow-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{announcement.title}</CardTitle>
                      <Megaphone className="h-5 w-5 text-primary" />
                    </div>
                    <CardDescription>
                      Posted on {announcement.created_at?.slice(0,10) || ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground mb-3">{announcement.content}</p>
                    {announcement.tags && announcement.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {announcement.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    )}
                    {(role === 'admin' || role === 'owner') && (
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="icon" aria-label="Edit" onClick={() => openEdit(announcement)}><EditIcon className="h-4 w-4" /></Button>
                        <Button variant="destructive" size="icon" aria-label="Delete" onClick={() => handleDelete(announcement.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <textarea id="content" className="w-full border rounded-md p-2 min-h-[100px]" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <DialogFooter>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
