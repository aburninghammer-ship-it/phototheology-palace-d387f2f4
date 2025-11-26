-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view their own lists and public lists" ON public.memory_verse_lists;

-- Recreate with correct join condition
CREATE POLICY "Users can view their own lists and public lists"
ON public.memory_verse_lists
FOR SELECT
USING (
  auth.uid() = user_id 
  OR is_public = true 
  OR EXISTS (
    SELECT 1 
    FROM memory_list_collaborators 
    WHERE memory_list_collaborators.list_id = memory_verse_lists.id 
    AND memory_list_collaborators.user_id = auth.uid()
  )
);