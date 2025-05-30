"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useUserRole } from "@/hooks/use-user-role";
import { toast } from "@/hooks/use-toast";
import CourseManager from "./CourseManager";
import LessonManager from "./LessonManager";
import EnrollmentManager from "./EnrollmentManager";

export default function ManageCoursesPage() {
  return (
    <div className="p-4 max-w-5xl mx-auto space-y-12">
      <CourseManager />
      <LessonManager />
      <EnrollmentManager />
    </div>
  );
}
