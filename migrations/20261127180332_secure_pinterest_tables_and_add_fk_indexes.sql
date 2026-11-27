-- Keep Pinterest OAuth tokens and publish queue private to server-side callers.
-- The application uses the postgres DATABASE_URL on the server and may use
-- service_role for server-side Supabase API calls. Both retain their access.

ALTER TABLE public.pinterest_connection ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pinterest_publish_jobs ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.pinterest_connection FROM anon, authenticated;
REVOKE ALL ON TABLE public.pinterest_publish_jobs FROM anon, authenticated;

-- Support category and page FAQ joins and category filtering.
CREATE INDEX IF NOT EXISTS category_faqs_category_id_idx
  ON public.category_faqs(category_id);

CREATE INDEX IF NOT EXISTS coloring_pages_category_id_idx
  ON public.coloring_pages(category_id);

CREATE INDEX IF NOT EXISTS faqs_coloring_page_id_idx
  ON public.faqs(coloring_page_id);
