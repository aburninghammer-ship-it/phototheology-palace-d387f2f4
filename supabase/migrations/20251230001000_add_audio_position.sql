-- Add column for cross-device audio reading position sync
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_audio_position JSONB DEFAULT NULL;

-- Add comment explaining the column
COMMENT ON COLUMN profiles.last_audio_position IS 'Stores the last audio reading position for cross-device sync. Contains sequenceName, seqIdx, itemIdx, verseIdx, timestamp.';
