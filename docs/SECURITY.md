# Security model and release checklist

- **Login**: Supabase Auth. Anonymous signup must be disabled in your Supabase project settings. Accounts provisioned by a trusted administrator.
- **Tenant isolation**: every sensitive table uses organization_id; RLS never trusts a browser-provided organization.
- **RBAC**: roles super_admin, admin, manager, dispatcher, warehouse, driver, merchant, accountant.
- **Write restrictions**: direct updates to shipments, stock balances, settlements and status events are deliberately blocked by RLS. Only role-checked SECURITY DEFINER routines write these. Never expose the service-role key client-side.
- **Tracking**: public lookup returns minimal non-PII fields; a 80-bit random tracking code is used. Add an edge/WAF rate limit (recommended production prerequisite).
- **Financials**: reconcile real cash before marking COD received; settlement creation and payment reference are recorded in audit_logs.
- **CSV**: spreadsheet formula injection neutralized.
- **Operations**: backups, MFA for finance/admin, staff offboarding, audit-log retention, incident monitoring, key rotation and restore drills must be configured.
- **Before launch**: use separate staging and production projects; test cross-org reads; test invalid status transitions; reconcile COD against actual cash; verify phone privacy and backups; configure HTTPS, WAF, alerts and abuse monitoring; commission an independent penetration test.
- **Known MVP gaps**: no 2FA enforcement workflow, no IP rate-limiter implementation, no secure staff invitation UI, no automated driver cash ledger, no fraud scoring, no complete return-to-sender financial workflow, no live GPS nor third-party integrations.
