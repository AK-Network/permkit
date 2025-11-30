import { error } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import type { PermissionContext } from "../shared/_types.ts";

export type LoadFunction<T> = (event: RequestEvent) => T | Promise<T>;
export type WhateverLoadReturns = (event: RequestEvent) => ReturnType<LoadFunction<any>>;

/**
 * @param permission {string}
 * @param load
 * @param getResource 
 * @returns 
 * 
 * 
 * #### This provides the magic:
 * ```ts
 * export const load = guard("posts:write", async (event) => { ... })
 * ```
 * Works in any `+page.server.ts` or `+layout.server.ts`.
 */
export function guard<T>(
  permission: string,
  load: LoadFunction<T>,
  getResource?: (event: RequestEvent) => any | Promise<any>
): WhateverLoadReturns {
  return (async (event: RequestEvent): Promise<T> => {
    const resource = getResource ? await getResource(event) : undefined;
    const allowed = await event.locals.can(permission, resource);

    if (!allowed) {
      throw error(403, `Forbidden: missing permission "${permission}"`);
    }

    return load(event);
  });
}