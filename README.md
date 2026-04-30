# 🎬 Content Approval Engine

A minimal full-stack content approval system built for agencies to share videos with clients and collect approval feedback in real-time.

## 🚀 Live Demo
[Add your Vercel URL here]

## 🛠️ Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (PostgreSQL + Realtime + Auth)
- Vercel (Deployment)

## ✨ Features

### Agency Dashboard
- Create new content (title + video URL)
- Automatically generates a shareable client link
- View all content pieces in a clean dashboard
- Status tracking: `pending`, `approved`, `rejected`
- Real-time updates when clients take action

### Client View
- Public page accessed via unique link (`/review/[id]`)
- Displays embedded video (YouTube, Vimeo, or MP4)
- Approve or reject content
- Feedback required on rejection

### Authentication
- Basic email/password login using Supabase Auth
- Protected dashboard route
- Session persistence
- Logout functionality

## 🧠 AI-Assisted Development

This project was built leveraging AI tools to:
- Scaffold the application structure
- Generate UI components using shadcn
- Speed up Supabase integration
- Iterate quickly on features and UX

## 🗄️ Database Schema

Table: `content_pieces`

| Column      | Type      | Description                  |
|------------|----------|------------------------------|
| id         | uuid     | Primary key                  |
| title      | text     | Content title                |
| video_url  | text     | Video link                   |
| status     | text     | pending / approved / rejected|
| feedback   | text     | Optional rejection feedback  |
| created_at | timestamp| Creation date                |
