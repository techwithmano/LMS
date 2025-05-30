"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/use-user-role";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle"; // Re-using for easy access

export default function ProfilePage() {
  const { role } = useUserRole();
  const userName = `${role.charAt(0).toUpperCase() + role.slice(1)} User`;
  const userEmail = `${role}@example.com`;
  const userInitials = userName.split(" ").map(n => n[0]).join("").substring(0,2).toUpperCase();
  const userId = "123456"; // Placeholder for user ID

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={`https://placehold.co/100x100.png?text=${userInitials}`} alt={userName} data-ai-hint="user profile" />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{userName}</CardTitle>
            <CardDescription>{userEmail}</CardDescription>
            <CardDescription>Role: {role.charAt(0).toUpperCase() + role.slice(1)}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline">Change Profile Picture</Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Update your personal details here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={userName} readOnly />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={userEmail} readOnly />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="userId">User ID</Label>
                <Input id="userId" value={userId} readOnly />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={role.charAt(0).toUpperCase() + role.slice(1)} readOnly />
              </div>
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="bio">Bio</Label>
                <textarea id="bio" rows={3} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Tell us a little about yourself..."></textarea>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Theme Preferences</h3>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Switch between light and dark mode.</p>
              <ThemeToggle />
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-medium mb-2">Password</h3>
             <div className="space-y-1.5">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-1.5">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </div>
          </div>
        </CardContent>
         <CardFooter>
            <Button>Update Password</Button>
          </CardFooter>
      </Card>
    </div>
  );
}
