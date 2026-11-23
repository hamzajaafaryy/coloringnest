# Pinterest official API auto-publishing

Set Production **server-side** environment variables:
- PINTEREST_APP_ID and PINTEREST_APP_SECRET from an approved Pinterest developer app
- PINTEREST_ENCRYPTION_KEY, a separate random 32+ character secret
- CRON_SECRET, a separate random 32+ character secret

Register this exact OAuth redirect URI:
https://www.craftcoloring.com/api/admin/pinterest/connect/callback

OAuth scopes: boards:read,boards:write,pins:read,pins:write (all four scopes listed in Pinterest's organic Pin creation guide). Existing connections must run **Reconnect Pinterest** to grant new scopes; refreshing a token cannot expand previously granted permissions. Visit /admin/pinterest-studio, click Connect Pinterest, authorize, choose an existing board and approve each specific Pin before publishing. Access and refresh tokens are AES-256-GCM encrypted in private PostgreSQL. The first authorized Pinterest connection or queue call uses the idempotent CREATE TABLE IF NOT EXISTS statements in migrations/20261104_pinterest_publishing.sql; database user must be able to create tables. No existing content data changes.

Vercel Hobby's cron runs **once daily with hour precision**, at 09:00 UTC, and publishes at most 3 *explicitly approved* Pins. Use Publish now for immediate individual publishing. A failed or ambiguous API response is never retried automatically: check Pinterest before creating a new approval.

Pinterest API Trial access only creates private sandbox Pins. **Public Pins require Standard access.**
See https://developers.pinterest.com/docs/key-concepts/access-tiers/ and https://policy.pinterest.com/en/developer-guidelines

Do not put credentials in GitHub, public Next.js env variables or chat. Disconnect from the Studio to delete the stored OAuth tokens and cancel future approvals. OAuth state is protected by short-lived httpOnly cookie; all other actions require the admin session.

## RSS auto-publishing images

The public RSS 2.0 feed is available at:
https://www.craftcoloring.com/feed.xml

Each published coloring page with a raster cover image gets one RSS item. Its `<enclosure>` and `<media:content>` both point to a public, generated 1000×1500 PNG at `/api/pinterest/pin/{pageId}`. The generated image uses the CraftColoring Pinterest editorial template; the original artwork image URL and the page itself are not modified. The public image endpoint only renders published pages and caches the generated PNG at the CDN for one day.

The feed is request-time/dynamic (not frozen during build), includes the latest 50 raster-backed published pages, and orders those items oldest-to-newest within that rolling set. SVG-only pages are intentionally omitted because the public Pin renderer currently requires a raster cover image. Pinterest reads the item title and description and extracts images from the enclosure/media tags. After deploying, open the feed URL and confirm each item has both image tags before connecting or refreshing the feed in Pinterest.

## Trial API Sandbox vs public Production

Pinterest error code 29 means **Trial apps cannot create Pins using https://api.pinterest.com**. Configure `PINTEREST_API_ENV=sandbox` and `PINTEREST_ACCESS_TIER=trial` in Vercel Production. Then **Reconnect Pinterest**: authorization tokens are tied to a particular environment and Pinterest requires using the sandbox OAuth token endpoint `https://api-sandbox.pinterest.com/v5/oauth/token`. Sandbox Boards are separate; use the Studio button to create or find a test Board. Every Sandbox Pin is creator-visible only and does not generate public reach. Existing Production queue entries are isolated and cannot be published accidentally in Sandbox.

After you receive **Standard Access** from Pinterest, update Vercel to `PINTEREST_API_ENV=production` and `PINTEREST_ACCESS_TIER=standard`, redeploy and **Reconnect Pinterest** again. This restores use of the Production API and your real public Boards. The app never uses a Production token in Sandbox or vice versa.

For Standard Access approval record a video of your actual OAuth consent, admin Pin preview, explicit approval, API Sandbox test and result. Apply using My Apps → Upgrade. Do not claim Sandbox tests are public Pins.

Reference: https://developers.pinterest.com/docs/developer-tools/sandbox/ and https://developers.pinterest.com/docs/key-concepts/access-tiers/
