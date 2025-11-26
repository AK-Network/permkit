import { writable } from "svelte/store";

export interface ClientUser {
  id: string;
  roles?: string[];
  permissions?: string[];
  [key: string]: any;
}

interface PermissionStoreValue {
  user: ClientUser | null;
}

function createPermissionStore() {
  const initial: PermissionStoreValue = {
    user: typeof window !== "undefined"
      ? (window as any).__permissions ?? null
      : null
  };

  const { subscribe, set, update } = writable(initial);

  async function can(
    permission: string,
    resource?: Record<string, any>
  ): Promise<boolean> {
    // Client has no ABAC rules, so always ask server.
    try {
      const res = await fetch("/__permissions/check", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ permission, resource })
      });

      if (!res.ok) return false;
      const json = await res.json();
      return json.allowed === true;
    } catch (err) {
      console.warn("Permission check failed:", err);
      return false;
    }
  }

  return {
    subscribe,
    set,
    update,
    can
  };
}

export const permissions = createPermissionStore();
export default permissions;