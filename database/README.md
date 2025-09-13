# Database Setup

This directory contains SQL scripts for setting up the Habit Flow database schema.

## Setup Instructions

1. **Profiles Schema** (already set up):
   ```sql
   -- Run this first to set up user profiles
   \i profiles_schema.sql
   ```

2. **Habits Schema** (new):
   ```sql
   -- Run this to set up the habits table
   \i habits_schema.sql
   ```

## Database Tables

### profiles
- User profile information
- Linked to auth.users via foreign key
- Includes notification preferences

### habits
- User habits with title, description, and frequency
- Linked to auth.users via user_id foreign key
- Supports daily, weekly, and monthly frequencies
- Row Level Security (RLS) enabled for data isolation

## Security

All tables use Row Level Security (RLS) to ensure users can only access their own data. The policies are automatically applied when the schema scripts are run.
