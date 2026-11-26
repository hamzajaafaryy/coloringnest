# Pinterest category RSS feeds

The legacy public feed remains available at `/feed.xml` and is not changed.

Category-specific feeds use the canonical category slugs from the live Supabase category catalog:

- `/feed/animals.xml`
- `/feed/christmas.xml`
- `/feed/halloween.xml`
- `/feed/dinosaurs.xml`
- `/feed/unicorn.xml`
- `/feed/all.xml`

The examples above are illustrative, not a hard-coded allowlist. Every category returned by the site's published category catalog is available automatically at `/feed/{category-slug}.xml`. Category aliases are normalized to the same canonical category. New categories added in the admin/database become available without code changes.

Each category feed includes only published coloring pages assigned to that category (including category rows consolidated under the canonical category), with a raster cover image and a slug. The all-categories feed includes the latest 50 eligible pages across the site. Feeds reuse the shared Pinterest editorial image endpoint, SEO metadata, XML escaping, and oldest-to-newest ordering within the rolling set.

Unknown category slugs return HTTP 404. The legacy `/feed.xml` route remains untouched.
