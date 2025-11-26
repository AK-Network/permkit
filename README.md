<!-- # Svelte library

Everything you need to build a Svelte library, powered by [`sv`](https://npmjs.com/package/sv).

Read more about creating a library [in the docs](https://svelte.dev/docs/kit/packaging).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is part of your library, everything inside `src/routes` can be used as a showcase or preview app.

## Building

To build your library:

```sh
npm pack
```

To create a production version of your showcase app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Publishing

Go into the `package.json` and give your package the desired name through the `"name"` option. Also consider adding a `"license"` field and point it to a `LICENSE` file which you can create from a template (one popular option is the [MIT license](https://opensource.org/license/mit/)).

To publish your library to [npm](https://www.npmjs.com):

```sh
npm publish
``` -->
# 🧩 Core Component Behavior

## RBAC Layer

static roles → permissions

expanded at login via server hook

## PBAC Layer

 * wildcard-aware string matcher
 * async overrides allowed

## ABAC Layer
 * async functions with signature:
```ts
condition: async ({ user, resource, env, permission }) => boolean
```

 * declarative JSON rules compiled into evaluators
 * priority: lowest number runs first
 * any explicit deny short-circuits
 * allow returned only if a rule explicitly states so

---
<br>


# ♻️ Hot-Reloading Rules

The engine exposes:

```ts
await engine.replaceRules(await loadRulesFromDB());
```

The SvelteKit handle hook updates the engine automatically every X seconds or via event trigger.

You can hook into:

```ts
engine.on('rules-updated', (newRules) => {
  console.log("Permission rules hot-reloaded");
});
```


# 💡 High-Level API

## Create the engine

`src/lib/permissions/engine.ts`

```ts
import {
  createPermissionEngine,
  type RuleSource
} from "@ak-network/permkit/server";

export const ruleSource: RuleSource = {
  async load() {
    // load rules dynamically (DB, filesystem, etc.)
    return await db.getPermissionRules();
  },

  async watch(callback) {
    // optional: use event emitter, polling, or DB triggers
    db.on("permission_rule_change", callback);
  }
};

export const engine = await createPermissionEngine({
  roles,
  permissions,
  ruleSource,
  defaultDeny: true,
});
```

---

## Checking Permission Server-Side
```ts
const result = await engine.check({
  user,
  permission: "posts.write",
  resource: { ownerId: user.id }
});
```

---

## Loading Permissions Into `locals`

`hooks.server.ts`:

```ts
import { handlePermissions } from "@ak-network/permkit/sveltekit/handle";
import { engine } from "$lib/permissions/engine";

export const handle = handlePermissions({ engine });
```

# Add route to handle permission checks

Because the client calls `/__permissions/check`, you need this endpoint in your app:
### src/routes/__permissions/check/+server.ts
```ts
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response(
      JSON.stringify({ allowed: false, reason: "not-logged-in" }),
      { 
				headers: { "content-type": "application/json" },
				status: 200,
			}
    );
  }

  const { permission, resource } = await request.json();

  const allowed = await locals.can(permission, resource);

  return new Response(JSON.stringify({ allowed }), {
    headers: { "content-type": "application/json" }
  });
};
```
### This endpoint:
 * is safe
 * uses server-side ABAC + RBAC + PBAC
 * exposes no sensitive rule details

---

## Client Side Permission Checking

```ts
import { permissionStore } from '@ak-network/permkit/client';

export const perms = permissionStore();
```

### Usage:
```ts
if ($perms.can("posts.write", { ownerId: 123 })) {
  // show action
}
```

---
## \<Can> Component

```html
<Can action="posts.update" {resource}>
  <button>Edit</button>
</Can>
```

<br/><br/>

# 🧠 Developer Integration Notes
In your `hooks.server.ts`:

```ts
import { handlePermissions } from "@ak-network/permkit/sveltekit";
import { engine } from "$lib/permissions/engine";

export const handle = handlePermissions({
  engine,
  getUser: async (event) => {
    // Example using a session cookie
    return event.locals.session?.user ?? null;
  },
  getEnv: async (event) => ({
    ip: event.getClientAddress(),
    time: new Date()
  })
});
```

<br/>

# 🧪 Usage Example (Server)

```ts
// +page.server.ts
import { guard } from "@ak-network/permkit/sveltekit";

export const load = guard(
  "posts.write",
  async (event) => {
    return {
      secret: "you can edit posts"
    };
  },
  (event) => {
    return { ownerId: event.locals.user?.id };
  }
);
```