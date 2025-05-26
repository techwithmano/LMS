import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search, UserPlus } from "lucide-react";

interface Message {
  id: string;
  sender: "me" | "other";
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  userName: string;
  lastMessage: string;
  avatarUrl?: string;
  avatarHint?: string;
  unreadCount?: number;
}

const sampleConversations: Conversation[] = [
  { id: "1", userName: "Jane Doe (Instructor)", lastMessage: "Sure, I can help with that.", avatarUrl: "https://placehold.co/40x40.png", avatarHint: "woman teacher", unreadCount: 2 },
  { id: "2", userName: "John Smith (Student)", lastMessage: "Thanks for the clarification!", avatarUrl: "https://placehold.co/40x40.png", avatarHint: "man student" },
  { id: "3", userName: "Admin Support", lastMessage: "Your request has been processed.", avatarUrl: "https://placehold.co/40x40.png", avatarHint: "support logo" },
];

const sampleMessages: Message[] = [
  { id: "1", sender: "other", text: "Hi there! I have a question about the last assignment.", timestamp: "10:30 AM" },
  { id: "2", sender: "me", text: "Hello! I'd be happy to help. What's your question?", timestamp: "10:31 AM" },
  { id: "3", sender: "other", text: "I'm having trouble with the first part regarding API integration.", timestamp: "10:32 AM" },
  { id: "4", sender: "me", text: "Okay, can you specify which API endpoint you are working with?", timestamp: "10:33 AM" },
];

export default function MessagesPage() {
  const activeConversation = sampleConversations[0]; // Mock active conversation

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Direct Messages</h1>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-hidden">
        {/* Conversation List */}
        <Card className="md:col-span-1 lg:col-span-1 flex flex-col">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle>Conversations</CardTitle>
              <Button variant="ghost" size="icon" aria-label="New Message">
                <UserPlus className="h-5 w-5" />
              </Button>
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search chats..." className="pl-8" />
            </div>
          </CardHeader>
          <ScrollArea className="flex-1">
            <CardContent className="p-0">
              {sampleConversations.map(convo => (
                <Button
                  key={convo.id}
                  variant="ghost"
                  className={`w-full justify-start h-auto p-3 rounded-none border-b ${convo.id === activeConversation.id ? 'bg-muted hover:bg-muted' : ''}`}
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={convo.avatarUrl} alt={convo.userName} data-ai-hint={convo.avatarHint}/>
                    <AvatarFallback>{convo.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="font-medium truncate">{convo.userName}</p>
                    <p className="text-xs text-muted-foreground truncate">{convo.lastMessage}</p>
                  </div>
                  {convo.unreadCount && convo.unreadCount > 0 && (
                    <span className="ml-2 text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                      {convo.unreadCount}
                    </span>
                  )}
                </Button>
              ))}
            </CardContent>
          </ScrollArea>
        </Card>

        {/* Active Chat Area */}
        <Card className="md:col-span-2 lg:col-span-3 flex flex-col">
          {activeConversation ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                     <AvatarImage src={activeConversation.avatarUrl} alt={activeConversation.userName} data-ai-hint={activeConversation.avatarHint} />
                    <AvatarFallback>{activeConversation.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{activeConversation.userName}</CardTitle>
                    <CardDescription>Online</CardDescription> {/* Mock status */}
                  </div>
                </div>
              </CardHeader>
              <ScrollArea className="flex-1 p-4 space-y-4">
                {sampleMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-lg ${msg.sender === 'me' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-blue-200' : 'text-muted-foreground'}`}>{msg.timestamp}</p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <CardFooter className="border-t p-4">
                <div className="flex w-full items-center space-x-2">
                  <Input placeholder="Type a message..." className="flex-1" />
                  <Button>
                    <Send className="h-5 w-5" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </CardFooter>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Select a conversation to start messaging.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
