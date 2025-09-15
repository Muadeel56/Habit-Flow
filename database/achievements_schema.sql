-- Create achievements table to define available badges
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL, -- Icon name/class for the badge
  type TEXT NOT NULL CHECK (type IN ('streak', 'completion', 'consistency', 'milestone')),
  requirement_value INTEGER NOT NULL, -- e.g., 7 for 7-day streak
  requirement_type TEXT NOT NULL CHECK (requirement_type IN ('current_streak', 'best_streak', 'total_completions', 'consecutive_days', 'habits_count')),
  points INTEGER DEFAULT 0, -- Points awarded for this achievement
  color TEXT DEFAULT '#10B981', -- Badge color
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_achievements table to track earned badges
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE, -- Optional: specific habit that triggered the achievement
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress_value INTEGER, -- The actual value that earned the achievement (e.g., streak length)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id, habit_id) -- Prevent duplicate achievements per habit
);

-- Set up Row Level Security (RLS)
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Everyone can view achievements" ON achievements;
DROP POLICY IF EXISTS "Users can view their own earned achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can insert their own earned achievements" ON user_achievements;

-- Create policies for achievements (everyone can view available achievements)
CREATE POLICY "Everyone can view achievements" ON achievements
  FOR SELECT USING (is_active = true);

-- Create policies for user_achievements
CREATE POLICY "Users can view their own earned achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own earned achievements" ON user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_achievements_type ON achievements(type);
CREATE INDEX IF NOT EXISTS idx_achievements_requirement_type ON achievements(requirement_type);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_habit_id ON user_achievements(habit_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_earned_at ON user_achievements(earned_at);

-- Insert default achievements
INSERT INTO achievements (name, description, icon, type, requirement_value, requirement_type, points, color) VALUES
  ('First Step', 'Complete your first habit', '🎯', 'milestone', 1, 'total_completions', 10, '#10B981'),
  ('Week Warrior', 'Maintain a 7-day streak', '🔥', 'streak', 7, 'current_streak', 50, '#F59E0B'),
  ('Streak Master', 'Achieve a 30-day streak', '⭐', 'streak', 30, 'current_streak', 200, '#8B5CF6'),
  ('Century Club', 'Complete 100 habits total', '💯', 'milestone', 100, 'total_completions', 300, '#EF4444'),
  ('Consistency King', 'Maintain a 14-day streak', '👑', 'streak', 14, 'current_streak', 100, '#3B82F6'),
  ('Habit Hero', 'Achieve a 50-day streak', '🦸', 'streak', 50, 'current_streak', 500, '#EC4899'),
  ('Dedication Diamond', 'Achieve a 100-day streak', '💎', 'streak', 100, 'current_streak', 1000, '#06B6D4'),
  ('Triple Threat', 'Have 3 active habits', '🎪', 'milestone', 3, 'habits_count', 25, '#84CC16'),
  ('Habit Collector', 'Have 5 active habits', '📚', 'milestone', 5, 'habits_count', 50, '#F97316'),
  ('Legendary', 'Achieve a 365-day streak', '🏆', 'streak', 365, 'current_streak', 5000, '#DC2626')
ON CONFLICT (name) DO NOTHING;

-- Create function to check and award achievements
CREATE OR REPLACE FUNCTION check_and_award_achievements()
RETURNS TRIGGER AS $$
DECLARE
  achievement_record RECORD;
  user_total_completions INTEGER;
  user_active_habits_count INTEGER;
  current_streak_value INTEGER;
  best_streak_value INTEGER;
  target_habit_id UUID;
BEGIN
  -- Determine the habit_id based on which table triggered this function
  IF TG_TABLE_NAME = 'habit_completions' THEN
    target_habit_id := NEW.habit_id;
  ELSIF TG_TABLE_NAME = 'habits' THEN
    target_habit_id := NEW.id;
  END IF;

  -- Get user stats
  SELECT COUNT(*) INTO user_total_completions
  FROM habit_completions
  WHERE user_id = NEW.user_id;

  SELECT COUNT(*) INTO user_active_habits_count
  FROM habits
  WHERE user_id = NEW.user_id AND is_active = true;

  -- Get streak values for the specific habit (only if we have a target_habit_id)
  IF target_habit_id IS NOT NULL THEN
    SELECT current_streak, best_streak INTO current_streak_value, best_streak_value
    FROM habit_streaks
    WHERE habit_id = target_habit_id AND user_id = NEW.user_id;
  END IF;

  -- Check each achievement
  FOR achievement_record IN 
    SELECT * FROM achievements WHERE is_active = true
  LOOP
    -- Skip if user already has this achievement for this habit (or globally for non-habit-specific achievements)
    IF achievement_record.requirement_type IN ('current_streak', 'best_streak') THEN
      -- Habit-specific achievements (only check if we have a target_habit_id)
      IF target_habit_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM user_achievements 
        WHERE user_id = NEW.user_id 
        AND achievement_id = achievement_record.id 
        AND habit_id = target_habit_id
      ) THEN
        CONTINUE;
      END IF;
    ELSE
      -- Global achievements
      IF EXISTS (
        SELECT 1 FROM user_achievements 
        WHERE user_id = NEW.user_id 
        AND achievement_id = achievement_record.id
      ) THEN
        CONTINUE;
      END IF;
    END IF;

    -- Check if achievement criteria is met
    CASE achievement_record.requirement_type
      WHEN 'current_streak' THEN
        IF current_streak_value >= achievement_record.requirement_value THEN
          INSERT INTO user_achievements (user_id, achievement_id, habit_id, progress_value)
          VALUES (NEW.user_id, achievement_record.id, target_habit_id, current_streak_value);
        END IF;
      WHEN 'best_streak' THEN
        IF best_streak_value >= achievement_record.requirement_value THEN
          INSERT INTO user_achievements (user_id, achievement_id, habit_id, progress_value)
          VALUES (NEW.user_id, achievement_record.id, target_habit_id, best_streak_value);
        END IF;
      WHEN 'total_completions' THEN
        IF user_total_completions >= achievement_record.requirement_value THEN
          INSERT INTO user_achievements (user_id, achievement_id, progress_value)
          VALUES (NEW.user_id, achievement_record.id, user_total_completions);
        END IF;
      WHEN 'habits_count' THEN
        IF user_active_habits_count >= achievement_record.requirement_value THEN
          INSERT INTO user_achievements (user_id, achievement_id, progress_value)
          VALUES (NEW.user_id, achievement_record.id, user_active_habits_count);
        END IF;
    END CASE;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to check achievements when habits are completed
DROP TRIGGER IF EXISTS check_achievements_on_completion ON habit_completions;
CREATE TRIGGER check_achievements_on_completion
  AFTER INSERT ON habit_completions
  FOR EACH ROW
  EXECUTE FUNCTION check_and_award_achievements();

-- Create trigger to check achievements when habits are created
DROP TRIGGER IF EXISTS check_achievements_on_habit_creation ON habits;
CREATE TRIGGER check_achievements_on_habit_creation
  AFTER INSERT ON habits
  FOR EACH ROW
  EXECUTE FUNCTION check_and_award_achievements(); 