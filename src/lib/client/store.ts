import { writable, type Writable } from "svelte/store";

/**
 * The shape of the client user object.
 */
export interface ClientUser {
	id: string;
	roles?: string[];
	permissions?: string[];
	[key: string]: any;
}

/**
 * The internal value stored in the permission store.
 * @internal
 */
export interface PermissionStoreValue {
	user: ClientUser | null;
}
/**
 * A Svelte store exposing the current user and a `can` method
 * to check permissions against the server.
 */
export interface PermissionStore extends Writable<PermissionStoreValue> {
	/**
	 * Checks a permission against a resource on the server.
	 * @param permission The permission string to check
	 * @param resource Optional resource context
	 */
	can(permission: string, resource?: Record<string, any>): Promise<boolean>;
}

function createPermissionStore(): PermissionStore {
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

export const permissions: PermissionStore = createPermissionStore();
export default permissions;