-- First, verify and add enum values if needed
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'bible_worker' AND enumtypid = 'public.church_member_role'::regtype) THEN
    ALTER TYPE public.church_member_role ADD VALUE 'bible_worker';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'guest' AND enumtypid = 'public.church_member_role'::regtype) THEN
    ALTER TYPE public.church_member_role ADD VALUE 'guest';
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- Ignore if already exists
  NULL;
END $$;