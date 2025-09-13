-- Create habit_completions table to track daily completions
CREATE TABLE IF NOT EXISTS habit_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  completed_date DATE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create habit_streaks table to track current and best streaks
CREATE TABLE IF NOT EXISTS habit_streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  last_completed_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(habit_id, user_id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_streaks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own habit completions" ON habit_completions;
DROP POLICY IF EXISTS "Users can insert their own habit completions" ON habit_completions;
DROP POLICY IF EXISTS "Users can update their own habit completions" ON habit_completions;
DROP POLICY IF EXISTS "Users can delete their own habit completions" ON habit_completions;

DROP POLICY IF EXISTS "Users can view their own habit streaks" ON habit_streaks;
DROP POLICY IF EXISTS "Users can update their own habit streaks" ON habit_streaks;
DROP POLICY IF EXISTS "Users can insert their own habit streaks" ON habit_streaks;

-- Create policies for habit_completions
CREATE POLICY "Users can view their own habit completions" ON habit_completions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habit completions" ON habit_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habit completions" ON habit_completions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habit completions" ON habit_completions
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for habit_streaks
CREATE POLICY "Users can view their own habit streaks" ON habit_streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own habit streaks" ON habit_streaks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habit streaks" ON habit_streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_user_id ON habit_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_date ON habit_completions(completed_date);
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_date ON habit_completions(habit_id, completed_date);

CREATE INDEX IF NOT EXISTS idx_habit_streaks_habit_id ON habit_streaks(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_streaks_user_id ON habit_streaks(user_id);

-- Create function to update habit streaks when a completion is added
CREATE OR REPLACE FUNCTION update_habit_streak()
RETURNS TRIGGER AS $$
DECLARE
  current_streak_count INTEGER := 0;
  best_streak_count INTEGER := 0;
  last_date DATE;
  streak_date DATE;
BEGIN
  -- Get current streak info
  SELECT current_streak, best_streak, last_completed_date
  INTO current_streak_count, best_streak_count, last_date
  FROM habit_streaks
  WHERE habit_id = NEW.habit_id AND user_id = NEW.user_id;

  -- If no streak record exists, create one
  IF NOT FOUND THEN
    INSERT INTO habit_streaks (habit_id, user_id, current_streak, best_streak, last_completed_date)
    VALUES (NEW.habit_id, NEW.user_id, 1, 1, NEW.completed_date);
    RETURN NEW;
  END IF;

  -- Calculate new streak
  IF last_date IS NULL OR last_date < NEW.completed_date - INTERVAL '1 day' THEN
    -- New streak or gap in streak
    current_streak_count := 1;
  ELSIF last_date = NEW.completed_date - INTERVAL '1 day' THEN
    -- Consecutive day
    current_streak_count := current_streak_count + 1;
  ELSE
    -- Same day or future date, don't change streak
    RETURN NEW;
  END IF;

  -- Update best streak if current is better
  IF current_streak_count > best_streak_count THEN
    best_streak_count := current_streak_count;
  END IF;

  -- Update or insert streak record
  INSERT INTO habit_streaks (habit_id, user_id, current_streak, best_streak, last_completed_date)
  VALUES (NEW.habit_id, NEW.user_id, current_streak_count, best_streak_count, NEW.completed_date)
  ON CONFLICT (habit_id, user_id)
  DO UPDATE SET
    current_streak = EXCLUDED.current_streak,
    best_streak = EXCLUDED.best_streak,
    last_completed_date = EXCLUDED.last_completed_date,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update streaks when completion is added
DROP TRIGGER IF EXISTS update_streak_on_completion ON habit_completions;
CREATE TRIGGER update_streak_on_completion
  AFTER INSERT ON habit_completions
  FOR EACH ROW
  EXECUTE FUNCTION update_habit_streak();

-- Create function to handle updated_at timestamp for habit_streaks
CREATE OR REPLACE FUNCTION handle_habit_streaks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at on habit_streaks
DROP TRIGGER IF EXISTS habit_streaks_updated_at ON habit_streaks;
CREATE TRIGGER habit_streaks_updated_at
  BEFORE UPDATE ON habit_streaks
  FOR EACH ROW
  EXECUTE FUNCTION handle_habit_streaks_updated_at();
