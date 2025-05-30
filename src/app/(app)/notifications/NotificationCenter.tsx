import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Notification {
  _id: string;
  message: string;
  type: string;
  createdAt: string;
  read: boolean;
}

export default function NotificationCenter({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  useEffect(() => {
    async function fetchNotifications() {
      const res = await axios.get(`/api/notifications?user=${userId}`);
      setNotifications(res.data);
    }
    fetchNotifications();
  }, [userId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-6">
          {notifications.map(n => (
            <li key={n._id} className={n.read ? "text-muted-foreground" : "font-bold"}>
              {n.message} <span className="text-xs text-gray-400">({new Date(n.createdAt).toLocaleString()})</span>
            </li>
          ))}
          {notifications.length === 0 && <li className="text-muted-foreground">No notifications.</li>}
        </ul>
      </CardContent>
    </Card>
  );
}
