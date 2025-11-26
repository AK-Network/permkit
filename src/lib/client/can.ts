import permissions from "./store.ts";

export async function can(permission: string, resource?: any) {
  return permissions.can(permission, resource);
}