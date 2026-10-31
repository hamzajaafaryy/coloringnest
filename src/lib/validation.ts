import { z } from "zod";
export const uuid = z.string().uuid();
export const shipmentInput = z.object({
  merchant_id: uuid,
  recipient_name: z.string().trim().min(2).max(100),
  recipient_phone: z.string().trim().regex(/^\\+?[0-9 ]{9,16}$/, "Téléphone invalide"),
  destination_city: z.string().trim().min(2).max(80),
  delivery_address: z.string().trim().min(5).max(350),
  cod_amount_mad: z.coerce.number().min(0).max(1000000),
  delivery_fee_mad: z.coerce.number().min(0).max(10000),
  notes: z.string().trim().max(500).default("")
});
export const merchantInput = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(30),
  city: z.string().trim().max(80),
  default_fee_mad: z.coerce.number().min(0).max(10000)
});
export const driverInput = z.object({
  full_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(30),
  city: z.string().trim().max(80)
});
export function fromForm(data:FormData) {
  return Object.fromEntries(data.entries());
}
