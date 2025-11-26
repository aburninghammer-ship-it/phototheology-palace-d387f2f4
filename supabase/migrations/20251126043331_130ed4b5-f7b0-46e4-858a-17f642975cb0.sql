-- Add jeeves-vs-jeeves mode to allowed game modes
ALTER TABLE public.pt_multiplayer_games
  DROP CONSTRAINT IF EXISTS pt_multiplayer_games_game_mode_check;

ALTER TABLE public.pt_multiplayer_games
  ADD CONSTRAINT pt_multiplayer_games_game_mode_check
  CHECK (
    game_mode = ANY (
      ARRAY[
        'free-for-all'::text,
        'team'::text,
        'council'::text,
        'boss'::text,
        'battle-royale'::text,
        '1v1-jeeves'::text,
        'team-vs-jeeves'::text,
        'jeeves-vs-jeeves'::text
      ]
    )
  );