-- Fix for achievements trigger function that was causing habit creation to fail
-- The issue was that the function tried to access NEW.habit_id when triggered from habits table
-- but habits table has 'id' field, not 'habit_id'

-- Drop and recreate the function with proper handling for both tables
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