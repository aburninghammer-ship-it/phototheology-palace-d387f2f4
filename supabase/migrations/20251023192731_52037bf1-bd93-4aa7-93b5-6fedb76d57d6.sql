-- Fix RLS policy for game_moves to handle vs Jeeves games where player2_id is null
DROP POLICY IF EXISTS "Players can insert game moves" ON public.game_moves;

CREATE POLICY "Players can insert game moves"
ON public.game_moves
FOR INSERT
WITH CHECK (
  -- Allow if the player_id matches the authenticated user
  (auth.uid() = player_id)
  OR
  -- Allow null player_id (Jeeves/system moves) if user is player1 (handles vs Jeeves case)
  (player_id IS NULL AND EXISTS (
    SELECT 1 FROM public.games 
    WHERE games.id = game_moves.game_id 
    AND games.player1_id = auth.uid()
  ))
  OR
  -- Allow null player_id if user is player2 in multiplayer games
  (player_id IS NULL AND EXISTS (
    SELECT 1 FROM public.games 
    WHERE games.id = game_moves.game_id 
    AND games.player2_id = auth.uid()
    AND games.player2_id IS NOT NULL
  ))
);