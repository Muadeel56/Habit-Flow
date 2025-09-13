# Database Schema Setup

This directory contains the database schema files for the Habit Flow application.

## Setup Instructions

### 1. Supabase Database Setup

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the `profiles_schema.sql` file to create the profiles table and necessary policies

### 2. What the Schema Includes

- **profiles table**: Stores user profile information
- **Storage bucket**: For avatar uploads
- **Row Level Security (RLS)**: Ensures users can only access their own data
- **Triggers**: Automatically creates profile when user signs up and updates timestamps

### 3. Table Structure

```sql
profiles (
  id UUID PRIMARY KEY,           -- References auth.users(id)
  email TEXT NOT NULL,           -- User's email
  first_name TEXT,               -- User's first name
  last_name TEXT,                -- User's last name
  phone TEXT,                    -- User's phone number
  avatar_url TEXT,               -- URL to user's avatar image
  email_notifications BOOLEAN,   -- Email notification preference
  daily_reminders BOOLEAN,       -- Daily reminder preference
  weekly_reports BOOLEAN,        -- Weekly report preference
  created_at TIMESTAMP,          -- Record creation timestamp
  updated_at TIMESTAMP           -- Record update timestamp
)
```

### 4. Storage Bucket

- **Bucket name**: `avatars`
- **Public access**: Yes (for viewing avatars)
- **Path structure**: `avatars/{user_id}-{timestamp}.{extension}`

### 5. Security Policies

- Users can only view, insert, and update their own profile
- Users can upload, view, update, and delete their own avatars
- All avatar images are publicly viewable (but only the owner can modify)
