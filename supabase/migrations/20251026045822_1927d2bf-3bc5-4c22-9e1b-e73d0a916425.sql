-- Recreate growth journal view without security definer
DROP VIEW IF EXISTS public.user_growth_journal;

CREATE VIEW public.user_growth_journal 
WITH (security_invoker=true)
AS
SELECT 
  cs.id,
  cs.user_id,
  cs.challenge_id,
  cs.created_at,
  cs.content,
  cs.submission_data,
  cs.principle_applied,
  cs.time_spent,
  c.title as challenge_title,
  c.challenge_type,
  c.challenge_subtype,
  c.challenge_tier,
  c.principle_used,
  c.room_codes
FROM public.challenge_submissions cs
JOIN public.challenges c ON cs.challenge_id = c.id
ORDER BY cs.created_at DESC;

-- Grant access to growth journal view
GRANT SELECT ON public.user_growth_journal TO authenticated;