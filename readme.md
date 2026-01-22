# 📝 Blog Engine Backend

A high-performance blogging backend built with **Node.js**, **Express**, and **TypeScript**.  
This project uses **Prisma** for type-safe database access and **Better Auth** for secure authentication, including **Google OAuth**.

---

## ✨ Features

- 🔐 **Authentication**
  - Email & password (Better Auth)
  - Google OAuth
- 📝 **Post Management**
  - Create, update, delete, and fetch blog posts
- 💬 **Comment System**
  - User comments
  - Admin moderation
- 📊 **Admin Dashboard APIs**
  - Content & statistics endpoints
- ✉️ **Email Service**
  - Automated emails via SMTP (Nodemailer)
- 🧠 **Type Safety**
  - Fully written in TypeScript

---

## 🛠 Tech Stack

| Category | Technology |
|-------|------------|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js |
| ORM | Prisma |
| Database | PostgreSQL |
| Authentication | Better Auth |
| Email | Nodemailer |

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root:

```env
# Server
PORT=3000
APP_URL=http://localhost:4000

# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/prisma_blog?schema=public"

# Better Auth
BETTER_AUTH_SECRET=your_super_secret_key
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# SMTP / Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```
> ⚠️ **Never commit `.env` files to GitHub**

---

## 🚀 Getting Started

### Prerequisites

* Node.js **v18+**
* PostgreSQL

---

### Installation

Clone the repository:

```bash
git clone <your-repo-url>
cd server
```

Install dependencies:

```bash
npm install
```

---

### Database Setup

Generate Prisma client:

```bash
npx prisma generate
```

Push schema to database:

```bash
npx prisma db push
```

(Optional) Open Prisma Studio:

```bash
npx prisma studio
```

---

### Start Development Server

```bash
npm run dev
```

Server runs at:

```
http://localhost:3000
```

---

## 📂 Project Structure

```plaintext
.
├── src/
│   ├── scripts/          # Database seeding (seedAdmin.ts)
│   ├── server.ts         # Main server entry
│   ├── routes/           # Express route definitions
│   ├── controllers/      # Business logic
│   └── middleware/       # Auth & validation
├── prisma/
│   └── schema.prisma     # Prisma schema
├── .env                  # Environment variables
├── package.json          # Scripts & dependencies
└── tsconfig.json         # TypeScript configuration
```

---

## 🛣 API Reference

**Base URL**

```
http://localhost:3000
```

---

### 🔐 Authentication

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | `/api/auth/signup/email` | Register user |
| POST   | `/api/auth/signin/email` | Login user    |

---

### 📝 Posts

| Method | Endpoint                | Description                |
| ------ | ----------------------- | -------------------------- |
| POST   | `/api/posts`             | Create post                |
| PATCH  | `/api/posts/:id`             | Update post                |
| DELETE | `/api/posts/:id`             | Delete post                |
| GET    | `/api/posts/`             | Get all posts              |
| GET    | `/api/posts/me`     | Get logged-in user's posts |
| GET    | `/api/post/stats` | Admin statistics           |

---

### 💬 Comments

| Method | Endpoint                      | Description       |
| ------ | ----------------------------- | ----------------- |
| POST   | `/api/comments`               | Create comment    |
| GET    | `/api/comment/:id`            | Get comment by ID |
| PATCH  | `/api/comment/:id`         | Update comment    |
| DELETE | `/api/comment/:id`         | Delete comment    |
| PATCH  | `/api/comment/:id.moderate` | Admin moderation  |

---

## 📜 Scripts

| Command              | Description                            |
| -------------------- | -------------------------------------- |
| `npm run dev`        | Start development server with TS watch |
| `npm run seed:admin` | Seed initial admin user                |
| `npx prisma studio`  | Prisma database GUI                    |

---

## 🔐 Authentication Notes

* Uses **Better Auth**
* Supports:

  * Credentials authentication
  * Google OAuth
* Secure session handling
* Role-based admin endpoints

---

## 🛡 License

Licensed under the **ISC License**.

---

## ⭐ Notes

* Designed for scalability
* Clean architecture with separation of concerns
* Type-safe database access using Prisma
* Production-ready backend

---

🚀 **Happy Coding!**

```

---

If you want next:
- 📄 Prisma schema generation  
- 🐳 Docker + Docker Compose  
- 📘 Swagger / OpenAPI docs  
- 🔐 RBAC (Admin / User roles)

Just say the word 👌
```
