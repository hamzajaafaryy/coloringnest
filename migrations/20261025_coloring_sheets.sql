BEGIN;
ALTER TABLE coloring_pages ADD COLUMN IF NOT EXISTS updated_at timestamptz;
CREATE TABLE IF NOT EXISTS coloring_sheets (
  id text PRIMARY KEY,
  coloring_page_id bigint NOT NULL REFERENCES coloring_pages(id) ON DELETE CASCADE,
  title text NOT NULL,
  alt_text text NOT NULL,
  image_url text NOT NULL,
  svg_url text,
  sort_order bigint NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS coloring_sheets_page_order_idx ON coloring_sheets(coloring_page_id, sort_order);
ALTER TABLE coloring_sheets ENABLE ROW LEVEL SECURITY;
COMMIT;
