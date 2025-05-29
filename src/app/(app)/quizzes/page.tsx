import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckSquare, Edit, PlusCircle } from "lucide-react";
import Link from "next/link";

interface QuizAssignment {
  id: string;
  title: string;
  course: string;
  type: "Quiz" | "Assignment";
  dueDate: string;
  status: "Pending" | "Submitted" | "Graded";
  score?: string;
}

const sampleQuizzes: QuizAssignment[] = [
  { id: "1", title: "Module 1 Quiz", course: "Introduction to Next.js", type: "Quiz", dueDate: "2024-08-01", status: "Pending" },
  { id: "2", title: "Mid-term Assignment", course: "Advanced TypeScript", type: "Assignment", dueDate: "2024-08-15", status: "Submitted" },
  { id: "3", title: "Final Exam", course: "UI/UX Design Principles", type: "Quiz", dueDate: "2024-07-20", status: "Graded", score: "92/100" },
];

export default function QuizzesPage() {
  // In a real app, filter quizzes based on user role (student sees their quizzes, admin sees all/can create)
  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quizzes & Assignments</h1>
          <p className="text-muted-foreground">
            View your upcoming and past quizzes and assignments. Submit your work and check your grades.
          </p>
        </div>
        {/* Button for admins/owners to create new quiz - adjust based on role */}
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sampleQuizzes.map(item => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle>{item.title}</CardTitle>
                {item.type === "Quiz" ? <FileText className="h-5 w-5 text-primary" /> : <Edit className="h-5 w-5 text-primary" />}
              </div>
              <CardDescription>Course: {item.course}</CardDescription>
              <CardDescription>Type: {item.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Due Date: {item.dueDate}</p>
              <p className="text-sm">Status: <span className={`font-semibold ${
                item.status === "Graded" ? "text-green-600" :
                item.status === "Submitted" ? "text-blue-600" :
                "text-orange-600"
              }`}>{item.status}</span></p>
              {item.score && <p className="text-sm font-semibold">Score: {item.score}</p>}
              <div className="mt-4">
                {item.status === "Pending" && <Button className="w-full">{item.type === "Quiz" ? "Start Quiz" : "Submit Assignment"}</Button>}
                {item.status === "Submitted" && <Button variant="outline" className="w-full" disabled>View Submission</Button>}
                {item.status === "Graded" && <Button variant="secondary" className="w-full">View Results</Button>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
