import { matchPermission } from "./wildcard.ts";
import type { PermissionString } from "./_types.ts";

export function pbacAllows(
  required: PermissionString,
  assigned: PermissionString[]
): boolean {
  return assigned.some(p => matchPermission(required, p));
}