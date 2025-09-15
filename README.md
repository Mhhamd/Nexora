# Nexora

Nexora is a modern **social media application** built with **Next.js, TypeScript, Prisma, Redux, and Better Auth**.
It allows users to connect, share posts with images, and interact through likes, comments, follows, and notifications.

---

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Authentication**: [Better Auth](https://better-auth.com/) (Email/Password & Google OAuth)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Neon](https://neon.tech/) (serverless)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Media Storage**: [Cloudinary](https://cloudinary.com/)
- **Notifications**: Custom in-app notification system
- **Other**: Dark/Light theme toggle

---

## ✨ Features

- 🔐 **Authentication**: Register & sign in with email/password or Google.
- 👤 **Profile Management**: Edit profile info and avatar.
- 🔔 **Notifications**: Get notified when:
  - Someone follows you
  - Someone interacts with your posts
- 📝 **Posts**:
  - Create a post with an image
  - Like/unlike posts
  - Comment on posts
  - Delete own posts
- ❤️ **Engagement**:
  - View a user’s posts
  - View posts a user liked
  - Follow/unfollow users
- 🎨 **UI**:
  - Clean design with Tailwind + shadcn
  - Theme toggle (light/dark)

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/Nexora.git
cd Nexora

Install dependencies:
npm install


Set up environment variables in .env:
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE   # Neon connection string

BETTER_AUTH_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


Run database migrations:
npx prisma migrate dev


Start the development server:
npm run dev
```
