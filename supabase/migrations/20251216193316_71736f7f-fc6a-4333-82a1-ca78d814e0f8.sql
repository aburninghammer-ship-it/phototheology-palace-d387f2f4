-- Add missing RLS policies for youth tables

-- RLS Policies for youth_group_progress
CREATE POLICY "Youth leaders can view group progress"
ON public.youth_group_progress FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.youth_groups yg
    JOIN public.youth_leaders yl ON yl.group_id = yg.id
    WHERE yg.id = youth_group_progress.group_id
    AND yl.user_id = auth.uid()
    AND yl.is_active = true
  )
  OR EXISTS (
    SELECT 1 FROM public.youth_groups yg
    WHERE yg.id = youth_group_progress.group_id
    AND public.is_church_admin(auth.uid(), yg.church_id)
  )
);

CREATE POLICY "Youth leaders can manage group progress"
ON public.youth_group_progress FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.youth_groups yg
    JOIN public.youth_leaders yl ON yl.group_id = yg.id
    WHERE yg.id = youth_group_progress.group_id
    AND yl.user_id = auth.uid()
    AND yl.is_active = true
  )
);

-- RLS Policies for youth_attendance
CREATE POLICY "Youth leaders can view attendance"
ON public.youth_attendance FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.youth_groups yg
    JOIN public.youth_leaders yl ON yl.group_id = yg.id
    WHERE yg.id = youth_attendance.group_id
    AND yl.user_id = auth.uid()
    AND yl.is_active = true
  )
  OR user_id = auth.uid()
);

CREATE POLICY "Youth leaders can manage attendance"
ON public.youth_attendance FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.youth_groups yg
    JOIN public.youth_leaders yl ON yl.group_id = yg.id
    WHERE yg.id = youth_attendance.group_id
    AND yl.user_id = auth.uid()
    AND yl.is_active = true
  )
);

-- RLS Policies for youth_guest_invites
CREATE POLICY "Youth leaders can view invites"
ON public.youth_guest_invites FOR SELECT
TO authenticated
USING (
  invited_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.youth_groups yg
    JOIN public.youth_leaders yl ON yl.group_id = yg.id
    WHERE yg.id = youth_guest_invites.group_id
    AND yl.user_id = auth.uid()
    AND yl.is_active = true
  )
);

CREATE POLICY "Youth members can create invites"
ON public.youth_guest_invites FOR INSERT
TO authenticated
WITH CHECK (
  invited_by = auth.uid()
  AND (
    EXISTS (
      SELECT 1 FROM public.youth_members ym
      WHERE ym.group_id = youth_guest_invites.group_id
      AND ym.user_id = auth.uid()
      AND ym.is_active = true
    )
    OR EXISTS (
      SELECT 1 FROM public.youth_leaders yl
      WHERE yl.group_id = youth_guest_invites.group_id
      AND yl.user_id = auth.uid()
      AND yl.is_active = true
    )
  )
);

-- RLS Policies for youth_transitions
CREATE POLICY "Users can view their own transition"
ON public.youth_transitions FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR public.is_church_admin(auth.uid(), church_id)
  OR public.is_youth_overseer(auth.uid(), church_id)
);

CREATE POLICY "Youth overseers can manage transitions"
ON public.youth_transitions FOR ALL
TO authenticated
USING (
  public.is_church_admin(auth.uid(), church_id)
  OR public.is_youth_overseer(auth.uid(), church_id)
);

-- RLS Policies for youth_study_cycles
CREATE POLICY "Church members can view study cycles"
ON public.youth_study_cycles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.church_members cm
    WHERE cm.church_id = youth_study_cycles.church_id
    AND cm.user_id = auth.uid()
  )
);

CREATE POLICY "Church admins can manage study cycles"
ON public.youth_study_cycles FOR ALL
TO authenticated
USING (
  public.is_church_admin(auth.uid(), church_id)
  OR public.is_youth_overseer(auth.uid(), church_id)
);

-- RLS Policies for youth_cycle_enrollments
CREATE POLICY "Youth leaders can view cycle enrollments"
ON public.youth_cycle_enrollments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.youth_groups yg
    JOIN public.youth_leaders yl ON yl.group_id = yg.id
    WHERE yg.id = youth_cycle_enrollments.group_id
    AND yl.user_id = auth.uid()
    AND yl.is_active = true
  )
);

CREATE POLICY "Youth leaders can manage cycle enrollments"
ON public.youth_cycle_enrollments FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.youth_groups yg
    JOIN public.youth_leaders yl ON yl.group_id = yg.id
    WHERE yg.id = youth_cycle_enrollments.group_id
    AND yl.user_id = auth.uid()
    AND yl.is_active = true
  )
);

-- Insert the 12-week curriculum
INSERT INTO public.youth_curriculum_weeks (week_number, sanctuary_station, title, core_question, scripture_references, truth_statement, practice_activity, ew_theme, pt_focus, discussion_prompts, application_challenge) VALUES
(1, 'The Gate', 'Who Am I?', 'Am I an accident or called?', ARRAY['John 1:12', 'Isaiah 43:1'], 'Identity is received, not achieved', 'Write personal identity statements in Christ', 'God values the soul beyond measure', NULL, ARRAY['What defines your identity right now?', 'How does knowing you are called change things?', 'What lies about identity have you believed?'], 'Write 3 identity statements based on Scripture and share one with your group'),
(2, 'The Altar', 'Why Did Jesus Die?', 'Was the cross really necessary?', ARRAY['Isaiah 53:4-6', 'Romans 5:8', '1 Peter 2:24'], 'Sin is serious because love is serious', 'Name what Christ carried for us personally', 'The cross reveals the cost of redemption', 'CR - Concentration Room', ARRAY['Why could God not just forgive without the cross?', 'What did Jesus carry that belonged to you?', 'How does the cross change how you see yourself?'], 'Journal about one thing Christ bore for you that you have been carrying yourself'),
(3, 'The Laver', 'Can People Actually Change?', 'Is real transformation possible?', ARRAY['Romans 6:1-11', 'Ezekiel 36:25-27', '2 Corinthians 5:17'], 'Grace breaks chains, not just guilt', 'Habit audit plus prayer partnerships', 'Repentance leads to transformation', NULL, ARRAY['Have you ever tried to change something and failed?', 'What is the difference between willpower and grace?', 'Who in your life models real transformation?'], 'Identify one habit to surrender and find an accountability partner'),
(4, 'The Holy Place', 'Faith in Real Life', 'How do I live this out daily?', ARRAY['Exodus 25:8', 'Hebrews 8:1-2', 'Psalm 27:4'], 'God builds environments for growth', 'Establish a daily spiritual rhythm', NULL, 'BL - Blue Room Sanctuary', ARRAY['What does your daily rhythm look like right now?', 'Where does God fit in your schedule?', 'What would change if you met with God daily?'], 'Create a 15-minute daily devotional plan and practice it for one week'),
(5, 'The Lampstand', 'How to Read the Bible', 'Can I actually understand this book?', ARRAY['Psalm 119:105', 'Luke 24:27', '2 Timothy 3:16-17'], 'The Bible explains itself', 'Guided PT Bible drill using pattern recognition', 'Scripture is its own interpreter', 'PR - Pattern Room Chain Study', ARRAY['What makes the Bible hard to read?', 'How is Jesus in the Old Testament?', 'What patterns have you noticed in Scripture?'], 'Complete one chain study from Genesis to Revelation on a single theme'),
(6, 'The Table', 'Why Community Matters', 'Cannot I just follow Jesus alone?', ARRAY['Acts 2:42-47', 'John 6:48-58', 'Hebrews 10:24-25'], 'Faith grows in shared space', 'Write encouragement notes to group members', NULL, NULL, ARRAY['Why did the early church meet together so much?', 'What do you gain from community that you cannot get alone?', 'What holds you back from deeper fellowship?'], 'Encourage three people this week with Scripture or prayer'),
(7, 'The Incense', 'Does Prayer Do Anything?', 'Is anyone actually listening?', ARRAY['Revelation 8:3-4', 'Hebrews 7:25', 'James 5:16'], 'Prayer moves heaven', 'Build intercessory prayer lists', 'Prayer opens the heart to God', 'MR - Meditation Room', ARRAY['Have you ever felt like your prayers hit the ceiling?', 'What does it mean that Jesus intercedes for us?', 'Who needs your prayers right now?'], 'Pray for 5 specific people by name every day this week'),
(8, 'The Veil', 'Rules, Love, and Freedom', 'Why so many rules?', ARRAY['Psalm 40:8', 'James 2:8-12', 'John 14:15'], 'Law protects love', 'Explore Sabbath as rest, not argument', 'Law is a transcript of God character', 'Theme Room Law and Grace', ARRAY['Do rules feel like freedom or prison to you?', 'How is the law connected to love?', 'What does Sabbath mean to you personally?'], 'Keep the Sabbath intentionally this week and journal your experience'),
(9, 'The Ark', 'Judgment Without Fear', 'Should I be afraid of judgment?', ARRAY['Daniel 7:9-14', 'Daniel 8:14', 'Hebrews 9:27-28'], 'Judgment is good news for the faithful', 'Study the sanctuary judgment scene', 'Christ represents us before the Father', 'PR - Prophecy Room', ARRAY['What images come to mind when you hear judgment?', 'How does having an Advocate change judgment?', 'What does Daniel 7 reveal about the Son of Man?'], 'Read Daniel 7 and write down what Christ does for His people'),
(10, 'Three Angels', 'Truth for the End', 'What is God final message?', ARRAY['Revelation 14:6-12', 'Matthew 24:14'], 'End-time message is Christ-centered', 'Explain the three angels message simply', NULL, '3A - Three Angels Room', ARRAY['What is the everlasting gospel?', 'What does it mean to fear God and give Him glory?', 'How is this message good news, not fear?'], 'Write a one-paragraph summary of the three angels messages in your own words'),
(11, 'Mission', 'Why My Life Matters', 'Am I supposed to do something?', ARRAY['Matthew 28:19-20', 'Isaiah 58:6-7', 'Acts 1:8'], 'Every disciple is a minister', 'Invite one friend to group or church', NULL, NULL, ARRAY['What gifts has God given you?', 'Who in your life needs to hear about Jesus?', 'What scares you about sharing your faith?'], 'Invite one person to your group or share your testimony with someone this week'),
(12, 'Calling', 'Sent, Not Settled', 'What does God want me to do?', ARRAY['Jeremiah 29:11', 'Romans 12:1-2', 'Ephesians 2:10'], 'You are created for purpose', 'Commitment prayer and next steps declaration', NULL, 'Height Expansion Mastery', ARRAY['What stirs your heart when you think about serving God?', 'What would it look like to say yes to whatever God asks?', 'Are you ready to move from learner to leader?'], 'Write a personal commitment statement and pray over your next step in faith');