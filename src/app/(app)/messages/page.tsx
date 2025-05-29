import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";

export const metadata: Metadata = {
  title: "Messages | LMS",
  description: "Communicate with your instructors and classmates",
};

const conversations = [
  {
    id: "1",
    name: "John Smith",
    avatar: "/avatars/john.jpg",
    lastMessage: "When is the next assignment due?",
    timestamp: "10:30 AM",
    unread: true,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    avatar: "/avatars/sarah.jpg",
    lastMessage: "Great work on the project!",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: "3",
    name: "Mike Wilson",
    avatar: "/avatars/mike.jpg",
    lastMessage: "Let's discuss the group project",
    timestamp: "2 days ago",
    unread: false,
  },
];

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-gray-500">
          Communicate with your instructors and classmates
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="md:col-span-1">
          <CardHeader>
              <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  <Avatar>
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback>
                      {conversation.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">
                        {conversation.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {conversation.timestamp}
                      </p>
                    </div>
                    <p
                      className={`text-sm truncate ${
                        conversation.unread ? "font-semibold" : "text-gray-500"
                      }`}
                    >
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/avatars/john.jpg" />
                <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <div>
                <CardTitle>John Smith</CardTitle>
                <p className="text-sm text-gray-500">Online</p>
                  </div>
                </div>
              </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Messages will be displayed here */}
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white rounded-lg p-3 max-w-[70%]">
                  <p>When is the next assignment due?</p>
                  <p className="text-xs text-blue-100 mt-1">10:30 AM</p>
                    </div>
                  </div>
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
                  <p>The next assignment is due on March 15th.</p>
                  <p className="text-xs text-gray-500 mt-1">10:32 AM</p>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="mt-6 flex space-x-2">
              <Input
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
