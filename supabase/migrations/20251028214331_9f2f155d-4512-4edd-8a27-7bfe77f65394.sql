-- Create table for Strong's concordance entries (definitions)
CREATE TABLE IF NOT EXISTS public.strongs_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strongs_number TEXT NOT NULL UNIQUE,
  word TEXT NOT NULL,
  transliteration TEXT,
  pronunciation TEXT,
  definition TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('Hebrew', 'Greek')),
  kjv_translations TEXT,
  occurrences INTEGER DEFAULT 0,
  usage TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on strongs_number for fast lookups
CREATE INDEX IF NOT EXISTS idx_strongs_entries_number ON public.strongs_entries(strongs_number);

-- Create table for verses with Strong's numbers
CREATE TABLE IF NOT EXISTS public.verses_strongs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  word_position INTEGER NOT NULL,
  word_text TEXT NOT NULL,
  strongs_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(book, chapter, verse, word_position)
);

-- Create indexes for efficient verse lookups
CREATE INDEX IF NOT EXISTS idx_verses_strongs_reference ON public.verses_strongs(book, chapter, verse);
CREATE INDEX IF NOT EXISTS idx_verses_strongs_number ON public.verses_strongs(strongs_number);

-- Enable RLS
ALTER TABLE public.strongs_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verses_strongs ENABLE ROW LEVEL SECURITY;

-- Public read access for both tables
CREATE POLICY "Strong's entries are viewable by everyone"
  ON public.strongs_entries
  FOR SELECT
  USING (true);

CREATE POLICY "Verses with Strong's numbers are viewable by everyone"
  ON public.verses_strongs
  FOR SELECT
  USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Admins can manage Strong's entries"
  ON public.strongs_entries
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage verses with Strong's numbers"
  ON public.verses_strongs
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger to update updated_at
CREATE TRIGGER update_strongs_entries_updated_at
  BEFORE UPDATE ON public.strongs_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the existing demo data from strongsApi.ts into the database
-- Strong's entries
INSERT INTO public.strongs_entries (strongs_number, word, transliteration, pronunciation, definition, language, kjv_translations, occurrences, usage) VALUES
('G2316', 'θεός', 'theos', 'theh-os', 'a deity, especially (with G3588) the supreme Divinity; figuratively, a magistrate; by Hebraism, very', 'Greek', 'God, god, godly', 1343, 'Used of the one true God, also of false gods'),
('G25', 'ἀγαπάω', 'agapaō', 'ag-ap-ah-o', 'to love (in a social or moral sense)', 'Greek', 'love, beloved', 143, 'Refers to divine, unconditional love'),
('G2889', 'κόσμος', 'kosmos', 'kos-mos', 'orderly arrangement, i.e. decoration; by implication, the world (in a wide or narrow sense, including its inhabitants, literally or figuratively (morally))', 'Greek', 'world, adorning', 186, 'The created universe or the fallen system of mankind'),
('G1325', 'δίδωμι', 'didōmi', 'did-o-mee', 'to give (used in a very wide application, properly, or by implication, literally or figuratively; greatly modified by the connection)', 'Greek', 'give, grant, put', 415, 'To give, bestow, grant'),
('G3439', 'μονογενής', 'monogenēs', 'mon-og-en-ace', 'only-born, i.e. sole', 'Greek', 'only (begotten), only child', 9, 'Unique, one of a kind, only begotten'),
('G5207', 'υἱός', 'huios', 'hwee-os', 'a "son" (sometimes of animals), used very widely of immediate, remote or figuratively, kinship', 'Greek', 'Son, son, child', 382, 'A son, male offspring, descendant'),
('G4100', 'πιστεύω', 'pisteuō', 'pist-yoo-o', 'to have faith (in, upon, or with respect to, a person or thing), i.e. credit; by implication, to entrust (especially one''s spiritual well-being to Christ)', 'Greek', 'believe, commit, trust', 248, 'To believe, have faith in, trust'),
('G166', 'αἰώνιος', 'aiōnios', 'ahee-o-nee-os', 'perpetual (also used of past time, or past and future as well)', 'Greek', 'eternal, everlasting, for ever', 71, 'Eternal, without beginning or end'),
('G2222', 'ζωή', 'zōē', 'dzo-ay', 'life (literally or figuratively)', 'Greek', 'life(-time)', 135, 'Life, both physical and spiritual'),
('H7225', 'רֵאשִׁית', 'reshiyth', 'ray-sheeth', 'the first, in place, time, order or rank (specifically, a firstfruit)', 'Hebrew', 'beginning, first, chief', 51, 'Beginning, first, chief'),
('H430', 'אֱלֹהִים', 'elohiym', 'el-o-heem', 'gods in the ordinary sense; but specifically used (in the plural thus, especially with the article) of the supreme God', 'Hebrew', 'God, god, judge, goddess', 2606, 'The supreme God, also used for judges or gods'),
('H1254', 'בָּרָא', 'bara', 'baw-raw', 'to create; (qualified) to cut down (a wood), select, feed (as formative processes)', 'Hebrew', 'create, creator, make', 54, 'To create, shape, form (used exclusively of divine activity)'),
('H8064', 'שָׁמַיִם', 'shamayim', 'shaw-mah-yim', 'the sky (as aloft; the dual perhaps alluding to the visible arch in which the clouds move, as well as to the higher ether where the celestial bodies revolve)', 'Hebrew', 'heaven, heavens, air, sky', 420, 'Heaven, sky, the abode of God'),
('H776', 'אֶרֶץ', 'erets', 'eh-rets', 'the earth (at large, or partitively a land)', 'Hebrew', 'earth, land, country, ground', 2505, 'Earth, land, ground, country');

-- Insert verse data for John 3:16
INSERT INTO public.verses_strongs (book, chapter, verse, word_position, word_text, strongs_number) VALUES
('John', 3, 16, 1, 'For', NULL),
('John', 3, 16, 2, 'God', 'G2316'),
('John', 3, 16, 3, 'so', NULL),
('John', 3, 16, 4, 'loved', 'G25'),
('John', 3, 16, 5, 'the', NULL),
('John', 3, 16, 6, 'world', 'G2889'),
('John', 3, 16, 7, 'that', NULL),
('John', 3, 16, 8, 'he', NULL),
('John', 3, 16, 9, 'gave', 'G1325'),
('John', 3, 16, 10, 'his', NULL),
('John', 3, 16, 11, 'only begotten', 'G3439'),
('John', 3, 16, 12, 'Son', 'G5207'),
('John', 3, 16, 13, 'that', NULL),
('John', 3, 16, 14, 'whosoever', NULL),
('John', 3, 16, 15, 'believeth', 'G4100'),
('John', 3, 16, 16, 'in', NULL),
('John', 3, 16, 17, 'him', NULL),
('John', 3, 16, 18, 'should', NULL),
('John', 3, 16, 19, 'not', NULL),
('John', 3, 16, 20, 'perish', NULL),
('John', 3, 16, 21, 'but', NULL),
('John', 3, 16, 22, 'have', NULL),
('John', 3, 16, 23, 'everlasting', 'G166'),
('John', 3, 16, 24, 'life', 'G2222');

-- Insert verse data for Genesis 1:1
INSERT INTO public.verses_strongs (book, chapter, verse, word_position, word_text, strongs_number) VALUES
('Genesis', 1, 1, 1, 'In the beginning', 'H7225'),
('Genesis', 1, 1, 2, 'God', 'H430'),
('Genesis', 1, 1, 3, 'created', 'H1254'),
('Genesis', 1, 1, 4, 'the heaven', 'H8064'),
('Genesis', 1, 1, 5, 'and', NULL),
('Genesis', 1, 1, 6, 'the earth', 'H776');