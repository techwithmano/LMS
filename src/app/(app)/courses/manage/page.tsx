import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ManagedCourse {
  id: string;
  title: string;
  students: number;
  status: "Published" | "Draft";
  lastUpdated: string;
}

const sampleManagedCourses: ManagedCourse[] = [
  { id: "1", title: "Introduction to Next.js", students: 120, status: "Published", lastUpdated: "2024-07-15" },
  { id: "2", title: "Advanced TypeScript", students: 85, status: "Published", lastUpdated: "2024-07-10" },
  { id: "3", title: "UI/UX Design Principles", students: 200, status: "Draft", lastUpdated: "2024-06-20" },
  { id: "4", title: "Data Structures in Python", students: 0, status: "Draft", lastUpdated: "2024-07-18" },
];

export default function ManageCoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Management</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage all courses on the platform.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Course
        </Button>
      </div>

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
              {sampleManagedCourses.map(course => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell className="hidden md:table-cell">{course.students}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className={`px-2 py-1 text-xs rounded-full ${course.status === "Published" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"}`}>
                      {course.status}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{course.lastUpdated}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" aria-label="Edit Course">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" aria-label="Delete Course">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
