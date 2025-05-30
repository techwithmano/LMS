import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req: any) {
  const token = await getToken({ req });
  if (!token) return NextResponse.redirect("/login");
  // Add RBAC logic here if needed
  return NextResponse.next();
}
