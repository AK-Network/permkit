import type { Handle } from "@sveltejs/kit";
import type { PermissionEngine } from "../server/_engineTypes.ts";
import type { PermissionContext, UserAttributes } from "../shared/_types.ts";

export interface HandlePermissionsOptions {
  engine: PermissionEngine;
  /**
   * Extract the authenticated user from event.
   * You implement this in your app.
   */
  getUser?: (event: Parameters<Handle>[0]["event"]) => Promise<UserAttributes | null>;
  /**
   * Optional: compute environment attributes (IP, time, flags).
   */
  getEnv?: (event: Parameters<Handle>[0]["event"]) => Promise<Record<string, any>>;
  /**
   * Fields you want exposed to client (sanitize!).
   */
  clientExpose?: (user: UserAttributes) => Record<string, any>;
}


/**  
 * @param opts 
 * @returns 
 * 
 * 
 * ### This hook integrates:
 *  * loads user from your existing auth mechanism
 *  * injects permissions into `event.locals`
 *  * attaches `locals.can(permission, resource?)`
 *  * serializes safe permission context to client
 */
export function handlePermissions(opts: HandlePermissionsOptions): Handle {
  const {
    engine,
    getUser = async () => null,
    getEnv = async () => ({ time: new Date() }),
    clientExpose = (user) => ({ id: user.id, roles: user.roles })
  } = opts;

  return async ({ event, resolve }) => {
    const user = await getUser(event);
    const env = await getEnv(event);

    event.locals.user = user ?? null;

    event.locals.can = async (permission: string, resource?: any) => {
      if (!user) return false;

      const ctx: PermissionContext = {
        user,
        permission,
        resource,
        env
      };

      const result = await engine.check(ctx);
      return result.allowed;
    };

    // Attach serialized permissions context for client-side store
    event.locals._permissionPayload = user ? clientExpose(user) : null;

    return resolve(event, {
      transformPageChunk({ html }) {
        // Inject client payload into HTML
        if (!event.locals._permissionPayload) return html;

        const payload = JSON.stringify(event.locals._permissionPayload);
        const script = `<script>window.__permissions = ${payload};</script>`;

        return html.replace("</head>", `${script}</head>`);
      }
    });
  };
}