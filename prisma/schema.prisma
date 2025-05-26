// This is your Prisma schema file
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum UserRole {
  STUDENT
  TEACHER
  ADMIN
  OWNER
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

model User {
  id            String      @id @default(cuid())
  email         String      @unique
  name          String
  password      String
  role          UserRole    @default(STUDENT)
  status        UserStatus  @default(ACTIVE)
  avatarUrl     String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  lastLogin     DateTime?
  
  // Relations
  courses       Course[]    @relation("EnrolledCourses")
  taughtCourses Course[]    @relation("TeachingCourses")
  assignments   Assignment[]
  submissions   Submission[]
  announcements Announcement[]
  messages      Message[]   @relation("SentMessages")
  receivedMessages Message[] @relation("ReceivedMessages")
}

model Course {
  id          String    @id @default(cuid())
  title       String
  description String
  code        String    @unique
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  teacher     User      @relation("TeachingCourses", fields: [teacherId], references: [id])
  teacherId   String
  students    User[]    @relation("EnrolledCourses")
  assignments Assignment[]
  announcements Announcement[]
}

model Assignment {
  id          String    @id @default(cuid())
  title       String
  description String
  dueDate     DateTime
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  course      Course    @relation(fields: [courseId], references: [id])
  courseId    String
  createdBy   User      @relation(fields: [createdById], references: [id])
  createdById String
  submissions Submission[]
}

model Submission {
  id            String    @id @default(cuid())
  content       String
  grade         Float?
  feedback      String?
  submittedAt   DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  assignment    Assignment @relation(fields: [assignmentId], references: [id])
  assignmentId  String
  student       User      @relation(fields: [studentId], references: [id])
  studentId     String
}

model Announcement {
  id          String    @id @default(cuid())
  title       String
  content     String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  course      Course?   @relation(fields: [courseId], references: [id])
  courseId    String?
  createdBy   User      @relation(fields: [createdById], references: [id])
  createdById String
}

model Message {
  id          String    @id @default(cuid())
  content     String
  createdAt   DateTime  @default(now())
  read        Boolean   @default(false)
  
  // Relations
  sender      User      @relation("SentMessages", fields: [senderId], references: [id])
  senderId    String
  receiver    User      @relation("ReceivedMessages", fields: [receiverId], references: [id])
  receiverId  String
} 