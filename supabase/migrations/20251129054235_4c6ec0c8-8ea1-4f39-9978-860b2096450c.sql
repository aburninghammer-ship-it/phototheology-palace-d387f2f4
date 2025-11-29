-- Step 1: Add tier column to achievements table
ALTER TABLE public.achievements 
ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'black'));

-- Step 2: Update existing achievements to have proper categories and tiers
-- First, update all existing categories to new structure

-- Memory category (was explorer for rooms)
UPDATE public.achievements SET category = 'memory', tier = 'bronze' 
WHERE requirement_type = 'rooms_completed' AND requirement_count = 1;

UPDATE public.achievements SET category = 'memory', tier = 'silver' 
WHERE requirement_type = 'rooms_completed' AND requirement_count IN (5, 10);

UPDATE public.achievements SET category = 'memory', tier = 'gold' 
WHERE requirement_type = 'rooms_completed' AND requirement_count IN (19, 38, 50);

-- Mastery category (was master for floors)
UPDATE public.achievements SET category = 'mastery', tier = 'bronze' 
WHERE requirement_type = 'floors_completed' AND requirement_count = 1;

UPDATE public.achievements SET category = 'mastery', tier = 'silver' 
WHERE requirement_type = 'floors_completed' AND requirement_count = 3;

-- Streaks category (was dedicated)
UPDATE public.achievements SET category = 'streaks', tier = 'bronze' 
WHERE requirement_type = 'study_streak' AND requirement_count = 7;

UPDATE public.achievements SET category = 'streaks', tier = 'silver' 
WHERE requirement_type = 'study_streak' AND requirement_count = 30;

-- Partnership category (stays same)
UPDATE public.achievements SET category = 'partnership', tier = 'bronze' 
WHERE requirement_type = 'partnership_streak' AND requirement_count = 7;

UPDATE public.achievements SET category = 'partnership', tier = 'silver' 
WHERE requirement_type = 'partnership_streak' AND requirement_count = 30;

UPDATE public.achievements SET category = 'partnership', tier = 'gold' 
WHERE requirement_type = 'partnership_bonus_xp';

-- Training category (was scholar/perfectionist)
UPDATE public.achievements SET category = 'training', tier = 'bronze' 
WHERE requirement_type = 'drills_completed' AND requirement_count = 1;

UPDATE public.achievements SET category = 'training', tier = 'silver' 
WHERE requirement_type = 'drills_completed' AND requirement_count = 25;

UPDATE public.achievements SET category = 'training', tier = 'gold' 
WHERE requirement_type = 'perfect_drills';

-- Step 3: Insert new achievements across all 13 categories

-- MEMORY achievements (Palace rooms, 24FPS, visualization)
INSERT INTO public.achievements (name, description, category, tier, requirement_type, requirement_count, points, icon) VALUES
('Palace Initiate', 'Enter your first room in the Memory Palace', 'memory', 'bronze', 'rooms_completed', 1, 10, '🚪'),
('Room Explorer', 'Complete 10 Palace rooms', 'memory', 'silver', 'rooms_completed', 10, 50, '🏛️'),
('Palace Architect', 'Complete 25 Palace rooms', 'memory', 'gold', 'rooms_completed', 25, 150, '🏰'),
('Memory Grandmaster', 'Complete all 38 Palace rooms', 'memory', 'black', 'rooms_completed', 38, 500, '👑'),
('24FPS Beginner', 'Complete your first 24FPS chapter visualization', 'memory', 'bronze', '24fps_chapters', 1, 15, '🎬'),
('Visual Thinker', 'Complete 10 24FPS visualizations', 'memory', 'silver', '24fps_chapters', 10, 75, '🎥'),
('Cinematic Scholar', 'Complete 24 24FPS visualizations', 'memory', 'gold', '24fps_chapters', 24, 200, '🎞️')
ON CONFLICT DO NOTHING;

-- MASTERY achievements (Floors, assessments)
INSERT INTO public.achievements (name, description, category, tier, requirement_type, requirement_count, points, icon) VALUES
('Floor 1 Graduate', 'Complete Floor 1 of the Palace', 'mastery', 'bronze', 'floors_completed', 1, 100, '📜'),
('Rising Scholar', 'Complete 3 floors of the Palace', 'mastery', 'silver', 'floors_completed', 3, 300, '📚'),
('Palace Elder', 'Complete 5 floors of the Palace', 'mastery', 'gold', 'floors_completed', 5, 500, '🎓'),
('8th Floor Grandmaster', 'Complete all 8 floors of the Palace', 'mastery', 'black', 'floors_completed', 8, 1000, '🏆'),
('Assessment Ace', 'Pass your first floor assessment', 'mastery', 'bronze', 'assessments_passed', 1, 50, '✅'),
('Exam Champion', 'Pass 5 floor assessments', 'mastery', 'gold', 'assessments_passed', 5, 250, '🏅')
ON CONFLICT DO NOTHING;

-- STREAKS achievements
INSERT INTO public.achievements (name, description, category, tier, requirement_type, requirement_count, points, icon) VALUES
('First Flame', 'Maintain a 3-day study streak', 'streaks', 'bronze', 'study_streak', 3, 15, '🔥'),
('Consistent Warrior', 'Maintain a 14-day study streak', 'streaks', 'silver', 'study_streak', 14, 70, '⚔️'),
('Faithful Soldier', 'Maintain a 60-day study streak', 'streaks', 'gold', 'study_streak', 60, 300, '🛡️'),
('Hall of Flames', 'Maintain a 100-day study streak', 'streaks', 'black', 'study_streak', 100, 500, '👑'),
('Monthly Bronze', 'Complete a 30-day streak month', 'streaks', 'bronze', 'monthly_streak', 1, 100, '🥉'),
('Monthly Silver', 'Complete 3 streak months', 'streaks', 'silver', 'monthly_streak', 3, 200, '🥈'),
('Monthly Gold', 'Complete 6 streak months', 'streaks', 'gold', 'monthly_streak', 6, 400, '🥇')
ON CONFLICT DO NOTHING;

-- GAMES achievements
INSERT INTO public.achievements (name, description, category, tier, requirement_type, requirement_count, points, icon) VALUES
('Game Night Rookie', 'Complete your first Bible game', 'games', 'bronze', 'games_completed', 1, 10, '🎮'),
('Puzzle Solver', 'Complete 10 Bible games', 'games', 'silver', 'games_completed', 10, 50, '🧩'),
('Game Champion', 'Complete 50 Bible games', 'games', 'gold', 'games_completed', 50, 200, '🏆'),
('Escape Artist', 'Complete your first Escape Room', 'games', 'bronze', 'escape_rooms_completed', 1, 25, '🚪'),
('Escape Master', 'Complete 10 Escape Rooms', 'games', 'gold', 'escape_rooms_completed', 10, 150, '🗝️'),
('Chain Chess Rookie', 'Win your first Chain Chess match', 'games', 'bronze', 'chain_chess_wins', 1, 20, '♟️'),
('Chain Chess Pro', 'Win 25 Chain Chess matches', 'games', 'gold', 'chain_chess_wins', 25, 200, '♚')
ON CONFLICT DO NOTHING;

-- SCRIPTURE achievements
INSERT INTO public.achievements (name, description, category, tier, requirement_type, requirement_count, points, icon) VALUES
('First Verse', 'Memorize your first Bible verse', 'scripture', 'bronze', 'verses_memorized', 1, 10, '📖'),
('Scripture Student', 'Memorize 25 verses', 'scripture', 'silver', 'verses_memorized', 25, 75, '📜'),
('Word Warrior', 'Memorize 100 verses', 'scripture', 'gold', 'verses_memorized', 100, 300, '⚔️'),
('Living Library', 'Memorize 500 verses', 'scripture', 'black', 'verses_memorized', 500, 1000, '📚'),
('Chapter Reader', 'Read 10 chapters', 'scripture', 'bronze', 'chapters_read', 10, 20, '📖'),
('Book Finisher', 'Complete reading a full Bible book', 'scripture', 'silver', 'books_completed', 1, 100, '✅'),
('Testament Traveler', 'Complete the New Testament', 'scripture', 'gold', 'testaments_completed', 1, 500, '🏆')
ON CONFLICT DO NOTHING;

-- DEVOTIONALS achievements
INSERT INTO public.achievements (name, description, category, tier, requirement_type, requirement_count, points, icon) VALUES
('Devotional Starter', 'Complete your first devotional day', 'devotionals', 'bronze', 'devotional_days', 1, 10, '🌅'),
('7-Day Journey', 'Complete a 7-day devotional plan', 'devotionals', 'silver', 'devotional_plans_completed', 1, 50, '📅'),
('30-Day Pilgrim', 'Complete a 30-day devotional plan', 'devotionals', 'gold', 'devotional_plans_completed', 3, 150, '🚶'),
('Soul Shepherd', 'Share 50 personalized devotionals', 'devotionals', 'gold', 'devotionals_shared', 50, 300, '🐑'),
('Wounded Healer', 'Send devotionals to 10 struggling friends', 'devotionals', 'gold', 'ministry_devotionals', 10, 250, '💜')
ON CONFLICT DO NOTHING;

-- COMMUNITY achievements
INSERT INTO public.achievements (name, description, category, tier, requirement_type, requirement_count, points, icon) VALUES
('First Post', 'Create your first community post', 'community', 'bronze', 'posts_created', 1, 10, '📝'),
('Active Voice', 'Create 10 community posts', 'community', 'silver', 'posts_created', 10, 50, '📢'),
('Community Pillar', 'Create 50 community posts', 'community', 'gold', 'posts_created', 50, 200, '🏛️'),
('Encourager', 'Leave 25 encouraging comments', 'community', 'silver', 'comments_created', 25, 75, '💬'),
('Sanctuary Builder', 'Have 100 helpful interactions', 'community', 'gold', 'community_interactions', 100, 300, '🏠'),
('Elder of Encouragement', 'Receive 50 likes on your posts', 'community', 'gold', 'likes_received', 50, 200, '❤️')
ON CONFLICT DO NOTHING;

-- PARTNERSHIP achievements
INSERT INTO public.achievements (name, description, category, tier, requirement_type, requirement_count, points, icon) VALUES
('Study Buddy', 'Find your first study partner', 'partnership', 'bronze', 'partners_found', 1, 25, '🤝'),
('Iron Sharpens Iron', 'Maintain 30-day partner streak', 'partnership', 'silver', 'partnership_streak', 30, 150, '⚔️'),
('Threefold Cord', 'Form a 3-person study group', 'partnership', 'gold', 'group_formed', 1, 200, '🔗'),
('Digital House Fire', 'Start a study group that grows to 5+', 'partnership', 'gold', 'group_size', 5, 300, '🔥'),
('Chain Discipler', 'Train someone to lead their own group', 'partnership', 'black', 'disciples_trained', 1, 500, '👑')
ON CONFLICT DO NOTHING;

-- TRAINING achievements
INSERT INTO public.achievements (name, description, category, tier, requirement_type, requirement_count, points, icon) VALUES
('Drill Recruit', 'Complete your first practice drill', 'training', 'bronze', 'drills_completed', 1, 10, '🎯'),
('Drill Sergeant', 'Complete 50 practice drills', 'training', 'silver', 'drills_completed', 50, 100, '💪'),
('Training Master', 'Complete 200 practice drills', 'training', 'gold', 'drills_completed', 200, 300, '🏋️'),
('Perfect Strike', 'Score 100% on 5 drills', 'training', 'silver', 'perfect_drills', 5, 75, '🎯'),
('Flawless Warrior', 'Score 100% on 25 drills', 'training', 'gold', 'perfect_drills', 25, 250, '⭐')
ON CONFLICT DO NOTHING;

-- EXPLORER achievements
INSERT INTO public.achievements (name, description, category, tier, requirement_type, requirement_count, points, icon) VALUES
('Curious Mind', 'Try 5 different app features', 'explorer', 'bronze', 'features_used', 5, 25, '🔍'),
('Feature Hunter', 'Try 15 different app features', 'explorer', 'silver', 'features_used', 15, 75, '🗺️'),
('Palace Tourist', 'Visit all 8 floors', 'explorer', 'bronze', 'floors_visited', 8, 50, '🎒'),
('Palace Historian', 'Complete the palace tour guide', 'explorer', 'silver', 'tour_completed', 1, 100, '📜'),
('Palace Guardian', 'Unlock all rooms in the Palace', 'explorer', 'gold', 'rooms_unlocked', 38, 300, '🛡️')
ON CONFLICT DO NOTHING;

-- PT CODING achievements (Phototheology-specific)
INSERT INTO public.achievements (name, description, category, tier, requirement_type, requirement_count, points, icon) VALUES
('Code Apprentice', 'Learn your first PT room code', 'pt_coding', 'bronze', 'codes_learned', 1, 15, '🔤'),
('Code Journeyman', 'Master 10 PT room codes', 'pt_coding', 'silver', 'codes_learned', 10, 75, '📝'),
('Code Master', 'Master all PT room codes', 'pt_coding', 'gold', 'codes_learned', 38, 300, '🎓'),
('Dimension Walker', 'Apply all 5 dimensions to a verse', 'pt_coding', 'silver', 'dimensions_applied', 5, 100, '🌀'),
('Connect-6 Mastermind', 'Complete 10 Connect-6 chain studies', 'pt_coding', 'gold', 'connect6_completed', 10, 200, '🔗'),
('Sanctuary Blueprint', 'Map a passage to all sanctuary stations', 'pt_coding', 'gold', 'sanctuary_maps', 5, 250, '🏛️')
ON CONFLICT DO NOTHING;

-- PROPHECY achievements (Daniel & Revelation)
INSERT INTO public.achievements (name, description, category, tier, requirement_type, requirement_count, points, icon) VALUES
('Daniel 2 Navigator', 'Complete the Daniel 2 prophecy study', 'prophecy', 'bronze', 'prophecy_studies', 1, 50, '🗿'),
('2300-Day Scholar', 'Master the 2300-day prophecy', 'prophecy', 'silver', 'prophecy_2300', 1, 150, '📅'),
('Seven Churches Guide', 'Complete all 7 churches study', 'prophecy', 'silver', 'seven_churches', 1, 150, '⛪'),
('Beast Symbol Decoder', 'Identify all beast symbols correctly', 'prophecy', 'gold', 'beast_symbols', 1, 200, '🦁'),
('Revelation Master', 'Complete full Revelation study', 'prophecy', 'black', 'revelation_complete', 1, 500, '📖'),
('Prophecy Pathfinder', 'Complete Daniel + Revelation track', 'prophecy', 'black', 'prophecy_track', 1, 750, '🏆')
ON CONFLICT DO NOTHING;

-- MINISTRY achievements (Isaiah 58 + evangelism)
INSERT INTO public.achievements (name, description, category, tier, requirement_type, requirement_count, points, icon) VALUES
('Digital Samaritan', 'Pray for 10 community members', 'ministry', 'bronze', 'prayers_offered', 10, 25, '🙏'),
('Isaiah 58 Servant', 'Complete a ministry challenge', 'ministry', 'silver', 'ministry_challenges', 1, 100, '🤲'),
('House Fire Planter', 'Help start a new study group', 'ministry', 'gold', 'groups_planted', 1, 300, '🔥'),
('Soul Winner', 'Lead someone through Bible studies', 'ministry', 'gold', 'studies_led', 1, 400, '✨'),
('Ministry Launch Graduate', 'Complete ministry training', 'ministry', 'black', 'ministry_training', 1, 500, '🎓')
ON CONFLICT DO NOTHING;