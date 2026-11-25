ALTER TABLE coloring_pages
  ADD COLUMN IF NOT EXISTS artwork_details text,
  ADD COLUMN IF NOT EXISTS color_ideas text,
  ADD COLUMN IF NOT EXISTS creative_activity text,
  ADD COLUMN IF NOT EXISTS coloring_benefits text,
  ADD COLUMN IF NOT EXISTS printing_guide text;
