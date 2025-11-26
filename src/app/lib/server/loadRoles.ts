import { Roles } from "./collections.ts";

export async function loadRoles() {
  const col = await Roles();
  const rows = await col.find().toArray();

  const map: Record<string, string[]> = {};
  rows.forEach((role) => {
    map[role.name] = role.permissions || [];
  });

  return map;
}