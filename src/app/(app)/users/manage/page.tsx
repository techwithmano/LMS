"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Search, UserCog } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserRole } from "@/hooks/use-user-role";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

// All Supabase logic removed. All user CRUD is now via /api/users endpoints using axios.

export default function ManageUsersPage() {
  const { role } = useUserRole();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    user_id: '',
    password: '',
    role: 'student',
  });
  const [creating, setCreating] = useState(false);
  const [createdCreds, setCreatedCreds] = useState<{email: string, password: string} | null>(null);

  // Fetch users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/users");
        setUsers(res.data);
      } catch (err: any) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  // Add user logic (Owner can add Admin, Admin/Owner can add Student)
  // ...implement add user modal and logic here...

  // Edit/delete logic (Owner/Admin as per policy)
  // ...implement edit/delete logic here...

  const canCreateAdmin = role === 'owner';
  const canCreateStudent = role === 'owner' || role === 'admin';

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreatedCreds(null);
    setError("");
    try {
      // 1. Create user in MongoDB via API
      const res = await axios.post("/api/users", newUser);
      setCreatedCreds({ email: newUser.email, password: newUser.password });
      toast({
        title: 'User created successfully',
        description: `User ID: ${newUser.user_id}, Password: ${newUser.password}`,
      });
      setShowDialog(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage all users on the platform, including students, admins, and owners.
          </p>
        </div>
        {(canCreateAdmin || canCreateStudent) && (
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => setShowDialog(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input id="full_name" value={newUser.full_name} onChange={e => setNewUser({ ...newUser, full_name: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="user_id">User ID</Label>
                  <Input id="user_id" value={newUser.user_id} onChange={e => setNewUser({ ...newUser, user_id: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUser.role} onValueChange={val => setNewUser({ ...newUser, role: val })}>
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {canCreateStudent && <SelectItem value="student">Student</SelectItem>}
                      {canCreateAdmin && <SelectItem value="admin">Admin</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
                {error && <div className="text-red-600 text-sm text-center">{error}</div>}
                <DialogFooter>
                  <Button type="submit" disabled={creating}>{creating ? 'Creating...' : 'Create User'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
        {createdCreds && (
          <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 mb-4">
            <div className="font-semibold mb-2">User Created!</div>
            <div>Email: <span className="font-mono">{createdCreds.email}</span></div>
            <div>Password: <span className="font-mono">{createdCreds.password}</span></div>
            <div className="text-xs mt-2 text-muted-foreground">Copy these credentials and send to the user. They will use them to log in.</div>
          </Card>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>View, edit, and manage user accounts and roles.</CardDescription>
          <div className="pt-4 flex flex-col md:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search users by name or email..." className="pl-8 w-full" />
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{user.full_name ? user.full_name.substring(0, 2).toUpperCase() : "US"}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.full_name || user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "owner" ? "destructive" : user.role === "admin" ? "secondary" : "outline"}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Active</span>
                    </TableCell>
                    <TableCell>
                      {(role === 'owner' || (role === 'admin' && user.role === 'student')) && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" aria-label="Edit User">
                            <UserCog className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" aria-label="Delete User">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
