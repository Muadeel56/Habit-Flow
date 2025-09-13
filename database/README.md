# Database Setup

This directory contains SQL scripts for setting up the Habit Flow database schema.

## Setup Instructions

1. **Profiles Schema** (already set up):
   ```sql
   -- Run this first to set up user profiles
   \i profiles_schema.sql
   ```

2. **Habits Schema**:
   ```sql
   -- Run this to set up the habits table
   \i habits_schema.sql
   ```

3. **Habit Completions Schema**:
   ```sql
   -- Run this to set up habit completions and streaks tracking
   \i habit_completions_schema.sql
   ```

4. **Achievements Schema** (new):
   ```sql
   -- Run this to set up achievements and badges system
   \i achievements_schema.sql
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

### habit_completions
- Tracks daily habit completions
- Linked to habits and users via foreign keys
- Includes completion date, timestamp, and optional notes
- Row Level Security (RLS) enabled for data isolation

### habit_streaks
- Tracks current and best streaks for each habit
- Automatically updated when completions are added
- Linked to habits and users via foreign keys
- Row Level Security (RLS) enabled for data isolation

### achievements
- Defines available badges and their requirements
- Includes streak-based, milestone-based, and completion-based achievements
- Each achievement has points, icons, and descriptions
- Publicly readable for all users

### user_achievements
- Tracks which achievements users have earned
- Links users to specific achievements with timestamps
- Can be tied to specific habits for habit-specific achievements
- Row Level Security (RLS) enabled for data isolation

## Security

All tables use Row Level Security (RLS) to ensure users can only access their own data. The policies are automatically applied when the schema scripts are run.

## Streak Logic

The streak calculation is handled automatically by database triggers:
- Current streak increments when habits are completed on consecutive days
- Best streak is updated when current streak exceeds the previous best
- Streaks reset when there's a gap of more than one day between completions

## Achievement Logic

Achievement awarding is handled automatically by database triggers:
- Achievements are checked and awarded when habits are completed or created
- Streak-based achievements are awarded based on current or best streak values
- Milestone achievements are awarded based on total completions or number of active habits
- Each user can earn each achievement only once (per habit for habit-specific achievements)
- Achievement triggers run after habit completions and habit creation
