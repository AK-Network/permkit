import { matchPermission } from "./wildcard.ts";
import type { PermissionString } from "./_types.ts";

export function pbacAllows(
  required: PermissionString,
  assigned: PermissionString[]
): boolean {
	console.error("PBAC CHECK:", { required, assigned });
  return assigned.some(p => matchPermission(required, p));
}