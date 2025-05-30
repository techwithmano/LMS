import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Comment {
  _id: string;
  content: string;
  author: { name: string };
  createdAt: string;
}

export default function DiscussionBoard({ courseId }: { courseId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  useEffect(() => {
    fetchComments();
  }, [courseId]);
  async function fetchComments() {
    const res = await axios.get(`/api/comments?course=${courseId}`);
    setComments(res.data);
  }
  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    await axios.post("/api/comments", { content: newComment, course: courseId });
    setNewComment("");
    fetchComments();
  }
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Discussion Board</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePost} className="flex gap-2 mb-4">
          <Input value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Add a comment..." required />
          <Button type="submit">Post</Button>
        </form>
        <div className="space-y-2">
          {comments.map(c => (
            <div key={c._id} className="border rounded p-2">
              <div className="font-semibold">{c.author?.name || "User"}</div>
              <div>{c.content}</div>
              <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
            </div>
          ))}
          {comments.length === 0 && <div className="text-muted-foreground">No comments yet.</div>}
        </div>
      </CardContent>
    </Card>
  );
}
