# Pinterest official API auto-publishing

Set Production **server-side** environment variables:
- PINTEREST_APP_ID and PINTEREST_APP_SECRET from an approved Pinterest developer app
- PINTEREST_ENCRYPTION_KEY, a separate random 32+ character secret
- CRON_SECRET, a separate random 32+ character secret

Register this exact OAuth redirect URI:
https://www.craftcoloring.com/api/admin/pinterest/connect/callback

OAuth scopes: boards:read,pins:read,pins:write. Visit /admin/pinterest-studio, click Connect Pinterest, authorize, choose an existing board and approve each specific Pin before publishing. Access and refresh tokens are AES-256-GCM encrypted in private PostgreSQL. The first authorized Pinterest connection or queue call uses the idempotent CREATE TABLE IF NOT EXISTS statements in migrations/20261104_pinterest_publishing.sql; database user must be able to create tables. No existing content data changes.

Vercel Hobby's cron runs **once daily with hour precision**, at 09:00 UTC, and publishes at most 3 *explicitly approved* Pins. Use Publish now for immediate individual publishing. A failed or ambiguous API response is never retried automatically: check Pinterest before creating a new approval.

Pinterest API Trial access only creates private sandbox Pins. **Public Pins require Standard access.**
See https://developers.pinterest.com/docs/key-concepts/access-tiers/ and https://policy.pinterest.com/en/developer-guidelines

Do not put credentials in GitHub, public Next.js env variables or chat. Disconnect from the Studio to delete the stored OAuth tokens and cancel future approvals. OAuth state is protected by short-lived httpOnly cookie; all other actions require the admin session.
