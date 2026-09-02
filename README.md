# Eraasoft Backend API

A RESTful API backend for the **Eraasoft** educational platform — powering course management, user authentication, enrollments, articles, and more. Built with **Express 5**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

## Tech Stack

| Layer          | Technology                       |
| -------------- | -------------------------------- |
| Runtime        | Node.js                         |
| Framework      | Express 5                       |
| Language       | TypeScript                      |
| ORM            | Prisma                          |
| Database       | PostgreSQL                      |
| Authentication | JWT + bcrypt                    |
| Email          | Nodemailer (OTP verification)   |
| Deployment     | Vercel (Serverless)             |

## Features

- 🔐 **Authentication** — Register, login, email verification via OTP, password reset
- 📚 **Courses** — Paid courses with pricing, discounts, categories, and rich content
- 🎥 **Free Courses** — Free video-based courses with featured highlights
- 📝 **Articles** — Blog/article system with categories, views tracking, and slugs
- 📩 **Enrollments** — Course enrollment with attendance method and branch selection
- ⭐ **Reviews** — Course review system
- ❓ **FAQs** — Frequently asked questions management
- 🤝 **Partners** — Partner/sponsor showcase
- 🗺️ **Journey Steps** — Learning journey visualization
- ✨ **Features** — Platform feature highlights
- 📬 **Contact** — Contact form message handling
- 👤 **User Profiles** — Profile management with avatar and bio

## Project Structure

```
eraasoft-backend/
├── api/
│   └── index.ts              # Vercel serverless entry point
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── seed.ts               # Database seeder
│   ├── data/                 # Seed data
│   └── migrations/           # Migration files
├── src/
│   ├── server.ts             # Express app setup & route mounting
│   ├── controllers/          # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── article.controller.ts
│   │   ├── contact.controller.ts
│   │   ├── course.controller.ts
│   │   ├── enrollment.controller.ts
│   │   ├── faq.controller.ts
│   │   ├── feature.controller.ts
│   │   ├── free-course.controller.ts
│   │   ├── journey.controller.ts
│   │   ├── partner.controller.ts
│   │   ├── review.controller.ts
│   │   └── user.controller.ts
│   ├── routes/               # Route definitions
│   │   ├── auth.routes.ts
│   │   ├── article.routes.ts
│   │   ├── contact.routes.ts
│   │   ├── course.routes.ts
│   │   ├── enrollment.routes.ts
│   │   ├── faq.routes.ts
│   │   ├── feature.routes.ts
│   │   ├── free-course.routes.ts
│   │   ├── journey.routes.ts
│   │   ├── partner.routes.ts
│   │   ├── review.routes.ts
│   │   └── user.routes.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT authentication guard
│   │   └── error.middleware.ts   # Global error handler & 404
│   ├── services/
│   │   └── email.service.ts     # Email sending (Nodemailer)
│   ├── utils/
│   │   ├── jwt.ts               # JWT token helpers
│   │   ├── otp.ts               # OTP generation & hashing
│   │   └── response.ts          # Standardized API responses
│   ├── lib/                     # Shared library (Prisma client)
│   └── types/                   # TypeScript type definitions
├── package.json
├── tsconfig.json
├── vercel.json
└── .env.example
```

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** database
- **npm**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Ahmed-Idrisx/eraasoft-backend.git
   cd eraasoft-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in the `.env` file:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/eraasoft"
   EMAIL_USER="your-email@example.com"
   EMAIL_PASSWORD="your-app-password"
   JWT_SECRET="your-secret-key"
   FRONTEND_URL="http://localhost:3000"
   ```

4. **Run database migrations**

   ```bash
   npx prisma migrate dev
   ```

5. **Seed the database** *(optional)*

   ```bash
   npm run seed
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

   The API will be running at `http://localhost:5000`.

## API Endpoints

### Authentication

| Method | Endpoint                        | Description              |
| ------ | ------------------------------- | ------------------------ |
| POST   | `/api/auth/register`            | Register a new user      |
| POST   | `/api/auth/login`               | Login                    |
| POST   | `/api/auth/verify-email`        | Verify email via OTP     |
| POST   | `/api/auth/forgot-password`     | Request password reset   |
| POST   | `/api/auth/reset-password`      | Reset password via OTP   |

### Courses

| Method | Endpoint                        | Description              |
| ------ | ------------------------------- | ------------------------ |
| GET    | `/api/courses`                  | List all courses         |
| GET    | `/api/courses/:slug`            | Get course by slug       |

### Free Courses

| Method | Endpoint                        | Description              |
| ------ | ------------------------------- | ------------------------ |
| GET    | `/api/free-courses`             | List all free courses    |
| GET    | `/api/free-courses/featured`    | Get featured free courses|
| GET    | `/api/free-courses/:slug`       | Get free course by slug  |

### Articles

| Method | Endpoint                        | Description              |
| ------ | ------------------------------- | ------------------------ |
| GET    | `/api/articles`                 | List all articles        |
| GET    | `/api/articles/latest`          | Get latest articles      |
| GET    | `/api/articles/:slug`           | Get article by slug      |

### Enrollments

| Method | Endpoint                        | Description              |
| ------ | ------------------------------- | ------------------------ |
| POST   | `/api/enrollments`              | Enroll in a course 🔒   |

### Reviews

| Method | Endpoint                        | Description              |
| ------ | ------------------------------- | ------------------------ |
| GET    | `/api/reviews`                  | Get course reviews       |

### Users

| Method | Endpoint                        | Description              |
| ------ | ------------------------------- | ------------------------ |
| GET    | `/api/users/me`                 | Get current user 🔒     |
| POST  | `/api/users/me`                 | Update profile 🔒       |

### Other

| Method | Endpoint                        | Description              |
| ------ | ------------------------------- | ------------------------ |
| GET    | `/api/faqs`                     | List all FAQs            |
| GET    | `/api/features`                 | List platform features   |
| GET    | `/api/journey`                  | Get journey steps        |
| GET    | `/api/partners`                 | List partners            |
| POST   | `/api/contact`                  | Submit contact message   |

> 🔒 = Requires JWT authentication via `Authorization: Bearer <token>` header.

## Scripts

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start dev server with hot reload (tsx)   |
| `npm run build`     | Compile TypeScript to JavaScript         |
| `npm start`         | Run the production build                 |
| `npm run seed`      | Seed the database with sample data       |

## Database Schema

The application uses the following data models:

- **User** — Authentication, profile, email verification
- **Otp** — One-time password codes for email verification & password reset
- **Course** — Paid courses with pricing, content, testimonials
- **FreeCourse** — Free video-based courses
- **Enrollment** — User ↔ Course enrollment records
- **Article** — Blog posts with categories and view counts
- **Faq** — Frequently asked questions
- **Feature** — Platform feature highlights
- **JourneyStep** — Learning journey milestones
- **Partner** — Partner/sponsor logos
- **ContactMessage** — Contact form submissions

## Deployment

This project is configured for **Vercel** serverless deployment. The `vercel.json` rewrites all routes to the `/api/index` entry point.

```bash
vercel deploy
```

## License

This project is licensed under the [MIT License](LICENSE).
