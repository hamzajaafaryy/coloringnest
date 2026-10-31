# Atlas Delivery — Operations Platform

Delivery-management **MVP** for Moroccan last-mile couriers (MAD / COD). Built with Next.js 16, TypeScript and Supabase Postgres/Auth.

## Implemented modules
- Staff authentication with Supabase email/password; organization-scoped roles and RLS.
- Dashboard with shipment, COD and delivery indicators.
- Merchant directory, drivers and dispatch, protected shipment creation / status timeline.
- Public **privacy-safe** tracking by unpredictable tracking code.
- Warehouse product stock with atomic signed movements and low-stock alerts.
- Cash-received reconciliation, merchant COD settlements and payment references.
- CSV export, audit events, responsive French-language interface.

## Requirements
Node 24, a Supabase project, and environment variables in `.env.local`.

## Install
1. `npm install`
2. Create a Supabase project. In its SQL editor, execute `supabase/migrations/202610310001_init.sql` once. Do **not** run twice (it creates types and tables).
3. In Supabase Authentication, **disable public signups** and invite/create an administrator using the Dashboard.
4. Create your organization and first admin profile with the bootstrap SQL example at the end of the migration. Use real UUIDs, **not** the example placeholders.
5. Copy `.env.example` to `.env.local` and set the public URL, publishable key and **server-only** service-role key.
6. Run `npm run dev`, then open http://localhost:3000/login.
7. Run `npm run test && npm run typecheck && npm run lint && npm run build`. The build also re-runs unit tests.
8. On Vercel set the same 3 environment values. Keep service role key server-side only.

## User provisioning
Invite users in Supabase Auth; add a row to `profiles` with the same auth UUID, organization ID and role.
For **merchant** users link `merchant_id`; for **driver** users link `driver_id`. Never let users choose their own role. Admin/team management UI is intentionally read-only until a secure invitation workflow is added.

## Security
Tenants are isolated with PostgreSQL RLS. Customer PII is readable only to authorized users. Shipment status, driver assignment, stock quantity and settlement changes use role-checked, atomic SQL RPC functions rather than uncontrolled direct table updates. Public tracking returns only tracking code, status, destination city and timestamps. See `docs/SECURITY.md`.

## Accounting model
A delivered shipment is **not** automatically cash-reconciled. Finance first records that COD money has been physically received via **Recevoir COD**, then groups eligible shipments into merchant settlements. Net payable is **COD minus delivery fees**. External payment integration, bank reconciliation, returns compensation, proof of delivery and tax invoicing are **not** implemented.

## Important limitations
This is a usable foundation / MVP, **not a production-certified courier ERP**. Test migrations, permissions, payments, load and operational procedures in staging before processing real money/PII. Configure external abuse/rate limiting for public tracking in production. See docs.
