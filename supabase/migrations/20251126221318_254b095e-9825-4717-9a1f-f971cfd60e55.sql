-- Create memory palace locations table
CREATE TABLE IF NOT EXISTS memory_palace_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  list_id UUID NOT NULL REFERENCES memory_verse_lists(id) ON DELETE CASCADE,
  verse_id UUID NOT NULL REFERENCES memory_verse_list_items(id) ON DELETE CASCADE,
  verse_reference TEXT NOT NULL,
  verse_text TEXT,
  location_name TEXT NOT NULL,
  visualization TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, verse_id)
);

-- Enable RLS
ALTER TABLE memory_palace_locations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own palace locations"
  ON memory_palace_locations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own palace locations"
  ON memory_palace_locations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own palace locations"
  ON memory_palace_locations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own palace locations"
  ON memory_palace_locations FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_memory_palace_user ON memory_palace_locations(user_id);
CREATE INDEX idx_memory_palace_list ON memory_palace_locations(list_id);
CREATE INDEX idx_memory_palace_order ON memory_palace_locations(user_id, list_id, order_index);

-- Trigger for updated_at
CREATE TRIGGER update_memory_palace_locations_updated_at
  BEFORE UPDATE ON memory_palace_locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add verse_text column to existing table if needed (for palace builder to access easily)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'memory_palace_locations' 
    AND column_name = 'verse_text'
  ) THEN
    ALTER TABLE memory_palace_locations ADD COLUMN verse_text TEXT;
  END IF;
END $$;