-- Add battle_code column to pt_card_battles table for multiplayer invites
ALTER TABLE pt_card_battles 
ADD COLUMN IF NOT EXISTS battle_code TEXT UNIQUE;

-- Create index for faster lookups by battle code
CREATE INDEX IF NOT EXISTS idx_pt_card_battles_battle_code 
ON pt_card_battles(battle_code) 
WHERE battle_code IS NOT NULL;