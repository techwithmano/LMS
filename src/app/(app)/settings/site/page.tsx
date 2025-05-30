"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea"; // Corrected import
import { Globe, Palette, ShieldCheck, Mail } from "lucide-react";

export default function SiteSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
      <p className="text-muted-foreground">
        Manage global settings for the Techwithmano LMS platform.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> General Settings</CardTitle>
          <CardDescription>Configure basic information about your LMS.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="siteName">Site Name</Label>
            <Input id="siteName" defaultValue="Techwithmano LMS" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="siteDescription">Site Description</Label>
            <Textarea id="siteDescription" defaultValue="A modern Learning Management System for tech enthusiasts." />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="maintenanceMode" />
            <Label htmlFor="maintenanceMode">Enable Maintenance Mode</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save General Settings</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" /> Appearance</CardTitle>
          <CardDescription>Customize the look and feel of your platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="logoUpload">Site Logo</Label>
            <Input id="logoUpload" type="file" />
            <p className="text-xs text-muted-foreground">Recommended dimensions: 200x50px. Max file size: 1MB.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="faviconUpload">Favicon</Label>
            <Input id="faviconUpload" type="file" />
            <p className="text-xs text-muted-foreground">Recommended dimensions: 32x32px. ICO or PNG format.</p>
          </div>
          {/* Theme colors are managed via globals.css and theme-toggle, this is illustrative */}
          <p className="text-sm text-muted-foreground">Theme colors can be customized in the application's CSS files.</p>
        </CardContent>
         <CardFooter>
          <Button>Save Appearance Settings</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" /> Email Settings</CardTitle>
          <CardDescription>Configure email server settings for notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="smtpHost">SMTP Host</Label>
            <Input id="smtpHost" placeholder="smtp.example.com" />
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1.5">
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input id="smtpPort" type="number" placeholder="587" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="smtpUser">SMTP Username</Label>
              <Input id="smtpUser" placeholder="user@example.com" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="smtpPass">SMTP Password</Label>
            <Input id="smtpPass" type="password" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fromEmail">Default From Email</Label>
            <Input id="fromEmail" type="email" placeholder="noreply@yourlms.com" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Email Settings</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Security</CardTitle>
          <CardDescription>Manage security settings for the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center space-x-2">
            <Switch id="allowRegistration" defaultChecked />
            <Label htmlFor="allowRegistration">Allow New User Registrations</Label>
          </div>
           <div className="flex items-center space-x-2">
            <Switch id="forceSsl" defaultChecked />
            <Label htmlFor="forceSsl">Force SSL (HTTPS)</Label>
          </div>
           <div className="space-y-1.5">
            <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
            <Input id="sessionTimeout" type="number" defaultValue="60" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Security Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
