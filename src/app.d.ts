// See https://svelte.dev/docs/kit/types#app.d.ts

import type { UserAttributes } from "$lib/shared/_types.ts";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: UserAttributes | null
			can: (permission: string, resource?: any) => Promise<boolean>
			_permissionPayload: Record<string, any> | {
				id: string;
				roles: string[] | undefined;
			} | null
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
