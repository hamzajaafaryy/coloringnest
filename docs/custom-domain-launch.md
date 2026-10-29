# Connecting the purchased domain

The current production origin stays `https://coloringnest.vercel.app` until the domain is owned and configured. No domain is purchased or redirected by default.

1. Add the exact purchased domain to the existing Vercel `coloringnest` project. Use the DNS records returned for that project and domain at its authoritative DNS provider; keep existing email records.
2. Wait for ownership verification, DNS propagation and HTTPS, then check the new domain serves the current site.
3. Set production `NEXT_PUBLIC_SITE_URL` to the chosen HTTPS origin, without a path or query. Add `SITE_REDIRECT_FROM_HOSTS` with the old hostname and any attached alternate hostname, comma separated. For example, after verifying `craftcoloring.com`, use `coloringnest.vercel.app,www.craftcoloring.com` if both source hosts are attached. Do not include the destination hostname.
4. Redeploy. This updates canonical URLs, Open Graph, Schema, robots and sitemap together. Host-scoped permanent redirects retain each path; Next.js also forwards incoming query parameters. Preview hostnames are not redirected unless explicitly listed.
5. Check `/`, an artwork, a collection, `/blog`, `/robots.txt` and `/sitemap.xml`. Verify an old artwork URL redirects to the same artwork on the new origin. Check the destination canonical and image URLs; avoid loops or irrelevant redirects to the homepage.
6. Verify the new Domain property in Search Console using the supplied DNS record and submit the new sitemap. For a URL-prefix property, optional `GOOGLE_SITE_VERIFICATION` adds the supplied public HTML verification code. Keep the old property and use Change of Address when applicable. Keep old URL redirects for at least a year.

## Blog content

Articles support paragraphs, `##`–`######` headings, `###` headings from older posts, bullet lists, numbered lists, **bold**, *emphasis*, inline code, fenced code blocks, and `[descriptive links](/coloring-pages/animals)`. An article's main title comes from its Title field. Raw HTML is displayed as text; only local, fragment and HTTP(S) links are clickable. Add real links to relevant drawings rather than leaving resource names as plain text.

Existing published blog posts are included in the sitemap automatically. Do not publish empty or duplicate articles to populate it. The article pack prepared separately remains editorial content until explicitly published.
