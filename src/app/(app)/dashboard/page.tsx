"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserRole } from "@/hooks/use-user-role"
import { BookOpen, ClipboardCheck, Users, TrendingUp, Settings, Megaphone, BarChart2 } from "lucide-react"
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  value?: string;
  link?: string;
}

function DashboardCard({ title, description, icon: Icon, value, link }: DashboardCardProps) {
  const content = (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <CardDescription>{description}</CardDescription>
      {value && <p className="text-2xl font-bold">{value}</p>}
    </CardHeader>
  );
  return link ? <a href={link} className="block hover:shadow-lg transition-shadow rounded-lg"><Card>{content}</Card></a> : <Card>{content}</Card>;
}

export default function DashboardPage() {
  const { role } = useUserRole();
  const [stats, setStats] = useState({ users: 0, students: 0, admins: 0, courses: 0, quizzes: 0, assignments: 0, submissions: 0 });

  useEffect(() => {
    if (role !== 'owner') return;
    const fetchStats = async () => {
      const [{ count: users }, { count: students }, { count: admins }, { count: courses }, { count: quizzes }, { count: assignments }, { count: submissions }] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin'),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('quizzes').select('*', { count: 'exact', head: true }).eq('type', 'Quiz'),
        supabase.from('quizzes').select('*', { count: 'exact', head: true }).eq('type', 'Assignment'),
        supabase.from('submissions').select('*', { count: 'exact', head: true }),
      ]);
      setStats({
        users: users || 0,
        students: students || 0,
        admins: admins || 0,
        courses: courses || 0,
        quizzes: quizzes || 0,
        assignments: assignments || 0,
        submissions: submissions || 0,
      });
    };
    fetchStats();
  }, [role]);

  const studentCards: DashboardCardProps[] = [
    { title: "My Courses", description: "Access your enrolled courses", icon: BookOpen, value: "3 Active", link: "/courses" },
    { title: "Upcoming Quizzes", description: "Check your upcoming quizzes", icon: ClipboardCheck, value: "2 Due Soon", link: "/quizzes" },
    { title: "Recent Announcements", description: "Latest updates and news", icon: Megaphone, link: "/announcements" },
  ];

  const adminCards: DashboardCardProps[] = [
    { title: "Course Statistics", description: "Overview of course engagement", icon: TrendingUp, value: "1,200 Students" },
    { title: "User Management", description: "Manage students and instructors", icon: Users, link: "/users/manage" },
    { title: "Create Announcement", description: "Publish new announcements", icon: Megaphone, link: "/announcements" },
    { title: "Manage Courses", description: "Edit and organize courses", icon: BookOpen, link: "/courses/manage" },
  ];

  const ownerCards: DashboardCardProps[] = [
    { title: "Site Analytics", description: "Overall platform statistics", icon: TrendingUp, value: "5,000 Users" },
    { title: "Manage Admins", description: "Add or remove administrators", icon: Users, link: "/users/manage" }, // Assuming owners manage admins here
    { title: "System Settings", description: "Configure platform settings", icon: Settings, link: "/settings/site" },
    { title: "Content Overview", description: "Summary of all courses and quizzes", icon: BookOpen, value: "50 Courses, 200 Quizzes" },
  ];

  let cardsToDisplay: DashboardCardProps[] = [];
  let welcomeMessage = "";

  switch (role) {
    case 'student':
      cardsToDisplay = studentCards;
      welcomeMessage = "Welcome back, Student!";
      break;
    case 'admin':
      cardsToDisplay = adminCards;
      welcomeMessage = "Admin Dashboard";
      break;
    case 'owner':
      cardsToDisplay = ownerCards;
      welcomeMessage = "Owner Dashboard";
      break;
    default:
      welcomeMessage = "Welcome to Techwithmano LMS!";
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">{welcomeMessage}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cardsToDisplay.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>
      {role === 'owner' && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle><Users className="inline mr-2" />Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.users}</div>
                <div className="text-muted-foreground">{stats.students} Students, {stats.admins} Admins</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle><BookOpen className="inline mr-2" />Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.courses}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle><ClipboardCheck className="inline mr-2" />Quizzes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.quizzes}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle><ClipboardCheck className="inline mr-2" />Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.assignments}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle><BarChart2 className="inline mr-2" />Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.submissions}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Explore the features and make the most of your learning/management experience.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-4">
          <Image 
            src="https://placehold.co/600x400.png" 
            alt="LMS illustration" 
            width={300} 
            height={200} 
            className="rounded-lg object-cover"
            data-ai-hint="education learning" 
          />
          <p className="text-muted-foreground">
            Techwithmano LMS provides a seamless and intuitive platform for online education. 
            Navigate through your courses, manage content, and stay connected with your peers and instructors.
            {role === 'student' && " Dive into your lessons, complete quizzes, and track your progress."}
            {role === 'admin' && " Efficiently manage courses, users, and platform announcements."}
            {role === 'owner' && " Oversee the entire platform, manage administrators, and configure system-wide settings."}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
