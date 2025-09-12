# Authentication Setup Guide

This guide will help you set up authentication for the Habit Flow application using Supabase.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. Node.js and npm installed

## Setup Steps

### 1. Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `habit-flow` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Choose the closest region to your users
5. Click "Create new project"

### 2. Get Your Supabase Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - Project URL
   - Anon public key

### 3. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 4. Configure Supabase Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure the following settings:
   - **Site URL**: `http://localhost:5173` (for development)
   - **Redirect URLs**: Add `http://localhost:5173/**`
   - **Email confirmation**: Enable if you want users to confirm their email
   - **Password requirements**: Configure as needed

### 5. Install Dependencies and Run

```bash
npm install
npm run dev
```

## Features Implemented

✅ **Sign Up Form**
- Email and password validation
- Password confirmation
- Error handling and display
- Loading states

✅ **Login Form**
- Email and password validation
- Error handling and display
- Loading states

✅ **Route Guards**
- Protected routes require authentication
- Automatic redirect to login for unauthenticated users
- Redirect to dashboard for authenticated users accessing auth pages

✅ **Auth State Management**
- Pinia store for authentication state
- Persistent session management
- Real-time auth state updates

✅ **User Interface**
- User menu in header with logout functionality
- Conditional layout rendering
- Responsive design with Tailwind CSS

## Usage

1. **Sign Up**: Navigate to `/signup` to create a new account
2. **Login**: Navigate to `/login` to sign in
3. **Protected Routes**: All main app routes (`/dashboard`, `/habits`, `/profile`) require authentication
4. **Logout**: Click on the user menu in the header and select "Sign out"

## File Structure

```
src/
├── lib/
│   └── supabase.ts          # Supabase client configuration
├── store/
│   └── auth.ts              # Authentication store (Pinia)
├── router/
│   ├── index.ts             # Router configuration with auth routes
│   └── guards.ts            # Route guards for authentication
├── views/
│   └── auth/
│       ├── Login.vue        # Login form component
│       └── SignUp.vue       # Sign up form component
└── components/
    └── layout/
        └── AppHeader.vue    # Updated header with user menu
```

## Security Notes

- Environment variables are prefixed with `VITE_` to be available in the browser
- The anon key is safe to expose in the frontend as it's designed for client-side use
- Supabase handles password hashing and secure session management
- Route guards prevent unauthorized access to protected pages

## Troubleshooting

1. **"Missing Supabase environment variables" error**: Make sure your `.env` file is properly configured
2. **Authentication not working**: Check your Supabase project settings and ensure the site URL is correct
3. **Redirect issues**: Verify your redirect URLs in Supabase authentication settings
