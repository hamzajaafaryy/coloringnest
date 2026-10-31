export const statuses = [
  "created", "confirmed", "pickup_scheduled", "picked_up", "in_transit",
  "out_for_delivery", "delivered", "refused", "returned", "cancelled"
] as const;
export type ShipmentStatus = typeof statuses[number];
export type Role = "super_admin" | "admin" | "manager" | "dispatcher" | "warehouse" | "driver" | "merchant" | "accountant";
export const internalRoles: Role[] = ["super_admin", "admin", "manager", "dispatcher", "warehouse", "accountant"];
export const editRoles: Role[] = ["super_admin", "admin", "manager", "dispatcher"];
export const financeRoles: Role[] = ["super_admin", "admin", "manager", "accountant"];
export const stockRoles: Role[] = ["super_admin", "admin", "manager", "warehouse"];
export const labels: Record<ShipmentStatus,string> = {
  created:"Créée", confirmed:"Confirmée", pickup_scheduled:"Collecte prévue",
  picked_up:"Ramassée", in_transit:"En transit", out_for_delivery:"En livraison",
  delivered:"Livrée", refused:"Refusée", returned:"Retournée", cancelled:"Annulée"
};
export const transitions: Record<ShipmentStatus,ShipmentStatus[]> = {
  created:["confirmed","cancelled"],
  confirmed:["pickup_scheduled","picked_up","cancelled"],
  pickup_scheduled:["picked_up","cancelled"],
  picked_up:["in_transit","returned"],
  in_transit:["out_for_delivery","returned"],
  out_for_delivery:["delivered","refused","in_transit"],
  delivered:[], refused:["returned"], returned:[], cancelled:[]
};
export function canTransition(from: ShipmentStatus, to: ShipmentStatus) {
  return transitions[from]?.includes(to) ?? false;
}
