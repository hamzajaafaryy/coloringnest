BEGIN;
ALTER TABLE coloring_pages
  ADD COLUMN IF NOT EXISTS meet_your_coloring_page text,
  ADD COLUMN IF NOT EXISTS what_youll_need text[],
  ADD COLUMN IF NOT EXISTS fun_coloring_ideas text[],
  ADD COLUMN IF NOT EXISTS learning_activity jsonb,
  ADD COLUMN IF NOT EXISTS make_it_your_own jsonb,
  ADD COLUMN IF NOT EXISTS printing_tips text[];
COMMIT;
