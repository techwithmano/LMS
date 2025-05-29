"use client"

import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useUserRole, type UserRole } from "@/hooks/use-user-role"
import { BookOpen, ClipboardCheck, Users, TrendingUp, Settings, Megaphone, FileText } from "lucide-react"
import Image from "next/image";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-gray-500">
          Here&apos;s an overview of your learning progress
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Due this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classmates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Across all courses
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium">Completed Assignment</p>
                  <p className="text-sm text-muted-foreground">
                    Introduction to Web Development
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium">New Course Material</p>
                  <p className="text-sm text-muted-foreground">
                    Advanced JavaScript Concepts
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium">Final Project Submission</p>
                  <p className="text-sm text-muted-foreground">
                    Due in 5 days
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium">Weekly Quiz</p>
                  <p className="text-sm text-muted-foreground">
                    Due in 2 days
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
