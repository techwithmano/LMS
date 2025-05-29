import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Megaphone, PlusCircle, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  tags?: string[];
}

const sampleAnnouncements: Announcement[] = [
  { id: "1", title: "Platform Maintenance Scheduled", content: "The platform will be undergoing scheduled maintenance on August 5th from 2 AM to 4 AM UTC. Access may be intermittent during this period.", date: "2024-07-28", author: "Admin Team", tags: ["Maintenance", "Important"] },
  { id: "2", title: "New Course Available: Advanced React Patterns", content: "We're excited to launch a new course on Advanced React Patterns! Enroll now to deepen your React knowledge.", date: "2024-07-25", author: "Course Team", tags: ["New Course"] },
  { id: "3", title: "Reminder: Mid-term Assignment Deadline", content: "A friendly reminder that the mid-term assignment for 'Advanced TypeScript' is due on August 15th. Please ensure timely submission.", date: "2024-07-22", author: "Jane Doe", tags: ["Deadline", "Reminder"] },
];

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">
            Stay updated with the latest news, updates, and important information.
          </p>
        </div>
        {/* Buttons for admins/owners - adjust based on role */}
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> New Announcement
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-6">
              {sampleAnnouncements.map(announcement => (
                <Card key={announcement.id} className="shadow-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{announcement.title}</CardTitle>
                      <Megaphone className="h-5 w-5 text-primary" />
                    </div>
                    <CardDescription>
                      Posted on {announcement.date} by {announcement.author}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground mb-3">{announcement.content}</p>
                    {announcement.tags && announcement.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {announcement.tags.map(tag => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
