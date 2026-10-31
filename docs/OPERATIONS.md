# Daily operations guide

1. **Admin** creates merchants and drivers (assign staff accounts in Supabase and profiles via trusted SQL).
2. **Merchant/dispatcher** creates delivery request (recipient, phone, address, COD, fee).
3. **Dispatcher** confirms order, plans pickup, assigns a courier, moves parcel through scan stages.
4. **Driver** sees only assigned deliveries and can set delivered/refused when out for delivery.
5. **Warehouse** adjusts stock with audited in/out movements; negative balances are rejected atomically.
6. **Accountant** verifies COD cash actually received; records each eligible delivered order as received.
7. **Accountant** creates settlement for selected delivered, reconciled, not-yet-settled shipments and marks paid with transfer reference.
8. **Customer** checks AT-... tracking code without access to name, address or phone.

## Status transitions
created -> confirmed -> pickup_scheduled -> picked_up -> in_transit -> out_for_delivery -> delivered.
Some steps allow cancellation, refusal, return or retry; all changes are checked in database.

## Deployment
Vercel supports Next.js, while Supabase provides hosted Postgres/Auth. Migrating Next.js to a PHP-only shared hosting plan is **not** equivalent to a full Node runtime; ensure your host supports SSR Node 22 and secure environment variables before switching.
