-- Migration script to add notification preferences to existing profiles table
-- Run this if the profiles table already exists and needs the new columns

-- Add new notification preference columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS push_notifications BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reminder_time TIME DEFAULT '09:00:00';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reminder_days INTEGER[] DEFAULT '{1,2,3,4,5,6,7}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notification_sound BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS quiet_hours_start TIME DEFAULT '22:00:00';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS quiet_hours_end TIME DEFAULT '08:00:00';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';

-- Update existing profiles with default values
UPDATE profiles 
SET 
  push_notifications = COALESCE(push_notifications, true),
  reminder_time = COALESCE(reminder_time, '09:00:00'::TIME),
  reminder_days = COALESCE(reminder_days, '{1,2,3,4,5,6,7}'::INTEGER[]),
  notification_sound = COALESCE(notification_sound, true),
  quiet_hours_start = COALESCE(quiet_hours_start, '22:00:00'::TIME),
  quiet_hours_end = COALESCE(quiet_hours_end, '08:00:00'::TIME),
  timezone = COALESCE(timezone, 'UTC')
WHERE 
  push_notifications IS NULL OR
  reminder_time IS NULL OR
  reminder_days IS NULL OR
  notification_sound IS NULL OR
  quiet_hours_start IS NULL OR
  quiet_hours_end IS NULL OR
  timezone IS NULL; 