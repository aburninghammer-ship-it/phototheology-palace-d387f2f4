-- Add updated_by column to user_studies
ALTER TABLE user_studies ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES auth.users(id);