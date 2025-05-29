# Learning Management System (LMS)

A modern, full-featured Learning Management System built with Next.js, Prisma, and PostgreSQL.

## Features

- 🔐 Secure authentication with JWT and NextAuth.js
- 👥 Role-based access control (Student, Teacher, Admin)
- 📚 Course management
- 📝 Assignment creation and submission
- 💬 Real-time messaging
- 📊 Progress tracking
- 📱 Responsive design
- 🔒 Security features (rate limiting, CSRF protection)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Rate Limiting:** Upstash Redis
- **Deployment:** Vercel

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Upstash Redis account (for rate limiting)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lms.git
   cd lms
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in the required environment variables in `.env`

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lms?schema=public"

# Authentication
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="7d"

# Next Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Redis (Upstash)
UPSTASH_REDIS_REST_URL="your-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"
```

## Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel
4. Deploy!

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting with Upstash Redis
- CSRF protection
- Security headers
- Input validation with Zod
- Role-based access control

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
