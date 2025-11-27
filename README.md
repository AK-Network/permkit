**@ak-network/permkit v0.1.0**

***

<!-- 
# PermKit

A lightweight permission engine for **Node.js** and **SvelteKit**, combining **RBAC** (Role-Based Access Control), 
**PBAC** (Permissions-Based Access Control) and **ABAC** (Attribute-Based Access Control).

> ⚠️ **Note:** Wildcard permissions are not supported yet. All permissions must match exactly.

---

## Installation

```bash
npm install @ak-network/permkit
# or
pnpm add @ak-network/permkit
```

---

## Core Concepts
### RBAC
- Users have roles.  
- Roles have assigned permissions.  

**Example:**

```ts
const roles = {
  admin: ['posts:read', 'posts:write'],
  editor: ['posts:read', 'posts:write'],
  viewer: ['posts:read']
};
```

### ABAC

- Rules are applied based on attributes of the user, resource, and environment.  
- Rules can allow or deny actions.  

**Example:**

```ts
const rules = [
  {
    name: 'allow-edit-own-post',
    effect: 'allow',
    priority: 1,
    condition: (ctx) => ctx.user.id === ctx.resource?.ownerId,
  },
  {
    name: 'deny-edit-others-post',
    effect: 'deny',
    priority: 2,
    condition: (ctx) => ctx.user.id !== ctx.resource?.ownerId,
  }
];
```

> Deny rules always take precedence over allow rules when priorities match.

---

## Creating a Permission Engine

```ts
// src/lib/server/permissions.ts
import { createPermissionEngine } from '@ak-network/permkit';

export const permissionEngine = await createPermissionEngine({
  roles: {
    admin: ['posts:read', 'posts:write'],
    editor: ['posts:read', 'posts:write']
  },
  ruleSource: {
    load: async () => rules
  },
  defaultDeny: true
});
```

---

## Checking Permissions in SvelteKit Endpoints

```ts
// src/routes/api/posts/[id]/edit/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { permissionEngine } from '$lib/server/permissions';
import { getPost } from '$lib/server/db';

export const POST: RequestHandler = async ({ params, locals }) => {
  const post = await getPost(params.id);

  const result = await permissionEngine.check({
    user: locals.user,
    permission: 'posts:write',
    resource: post
  });

  if (!result.allowed) {
    return new Response('Forbidden', { status: 403 });
  }

  // Perform update
  return new Response('Updated successfully');
};
```

---

## Environment-aware ABAC Example

```ts
// Allow an action only during office hours
const rules = [
  {
    name: 'office-hours-only',
    effect: 'allow',
    priority: 1,
    condition: (ctx) => {
      const hour = ctx.env?.time?.getHours() ?? 0;
      return hour >= 9 && hour <= 17;
    }
  }
];
```

---

## API Reference

### `createPermissionEngine(options)`

Creates a new permission engine.

**Options:**

- `roles: Record<string, string[]>` — RBAC role definitions.
- `ruleSource: { load: () => Promise<ABACRule[]> }` — ABAC rules loader.
- `defaultDeny?: boolean` — whether to deny by default (default `true`).
- `onRulesLoaded?: (rules: ABACRule[]) => void` — optional callback after rules load.

**Returns:** `Promise<PermissionEngine>`

---

### `PermissionEngine.check(ctx)`

Checks if a user has permission.

**Context (ctx):**

- `user: { id: string, roles?: string[], permissions?: string[] }`
- `permission: string` — permission string to check.
- `resource?: Record<string, any>` — optional resource attributes.
- `env?: Record<string, any>` — optional environment attributes.

**Returns:**

```ts
{
  allowed: boolean;
  reason: string;
  rule?: ABACRule;
}
```

---

### `PermissionEngine.getRules()`

Returns currently loaded ABAC rules.

### `PermissionEngine.replaceRules(newRules)`

Replace ABAC rules at runtime.

### `PermissionEngine.stop()`

Stops any watchers if `ruleSource` supports dynamic updates.

---

## Notes

- RBAC roles are expanded into individual permissions.  
- ABAC rules are evaluated after RBAC expansion.  
- Deny rules take precedence over allow rules if priorities match.  
- Wildcard permissions like `posts.*` are **not supported yet** — use exact permission strings.  
- The `env` context can include timestamps, IP addresses, or feature flags for dynamic rules.

<br /><br />
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
  permission: "posts:write",
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
if ($perms.can("posts:write", { ownerId: 123 })) {
  // show action
}
```

---
## \<Can> Component

```html
<Can action="posts:update" {resource}>
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
  "posts:write",
  async (event) => {
    return {
      secret: "you can edit posts"
    };
  },
  (event) => {
    return { ownerId: event.locals.user?.id };
  }
); 

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
  permission: "posts:write",
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
if ($perms.can("posts:write", { ownerId: 123 })) {
  // show action
}
```

---
## \<Can> Component

```html
<Can action="posts:update" {resource}>
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
  "posts:write",
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

---

## License

MIT -->
<!-- 
# PermKit

A lightweight permission engine for **Node.js** and **SvelteKit**, combining:

- **RBAC** (Role-Based Access Control)  
- **PBAC** (Permissions-Based Access Control)  
- **ABAC** (Attribute-Based Access Control)

> ⚠️ **Note:** Wildcard permissions are not supported yet. All permissions must match exactly.

---

## Installation

```bash
npm install @ak-network/permkit
# or
pnpm add @ak-network/permkit
```

# Core Concepts
## RBAC
- Users have roles.
- Roles have assigned permissions.

```ts
const roles = {
  admin: ['posts:read', 'posts:write'],
  editor: ['posts:read', 'posts:write'],
  viewer: ['posts:read']
};
```

## ABAC
- Rules are applied based on attributes of user, resource, and environment.
- Rules can allow or deny actions.

```ts
const rules = [
  {
    name: 'allow-edit-own-post',
    effect: 'allow',
    priority: 1,
    condition: (ctx) => ctx.user.id === ctx.resource?.ownerId,
  },
  {
    name: 'deny-edit-others-post',
    effect: 'deny',
    priority: 2,
    condition: (ctx) => ctx.user.id !== ctx.resource?.ownerId,
  }
];
```

> Deny rules always take precedence over allow rules when priorities match.

## Creating a Permission Engine

```ts
// src/lib/server/permissions.ts
import { createPermissionEngine } from '@ak-network/permkit';

export const permissionEngine = await createPermissionEngine({
  roles: {
    admin: ['posts:read', 'posts:write'],
    editor: ['posts:read', 'posts:write']
  },
  ruleSource: {
    load: async () => rules
  },
  defaultDeny: true
});
```

## Checking Permissions in SvelteKit Endpoints

```ts
// src/routes/api/posts/[id]/edit/+server.ts
import { permissionEngine } from '$lib/server/permissions';
import { getPost } from '$lib/server/db';

export const POST: RequestHandler = async ({ params, locals }) => {
  const post = await getPost(params.id);

  const result = await permissionEngine.check({
    user: locals.user,
    permission: 'posts:write',
    resource: post
  });

  if (!result.allowed) return new Response('Forbidden', { status: 403 });

  return new Response('Updated successfully');
};
```

## Environment-Aware ABAC Example

```ts
// Only allow actions during office hours
const rules = [
  {
    name: 'office-hours-only',
    effect: 'allow',
    priority: 1,
    condition: (ctx) => {
      const hour = ctx.env?.time?.getHours() ?? 0;
      return hour >= 9 && hour <= 17;
    }
  }
];
```

## API Reference

`createPermissionEngine(options)`

Creates a new permission engine.

*Options:*

`roles: Record<string, string[]>` — RBAC roles.

`ruleSource: { load: () => Promise<ABACRule[]> }` — ABAC rules loader.

`defaultDeny?: boolean` — deny by default (default true).

`onRulesLoaded?: (rules: ABACRule[]) => void` — callback after rules load.

Returns: `Promise<PermissionEngine>`

---

`PermissionEngine.check(ctx)`

Checks if a user has permission.

*Context:*
- `user: { id: string, roles?: string[], permissions?: string[] }`
- `permission: string` — permission to check.
- `resource?: Record<string, any>` — optional resource attributes.
- `env?: Record<string, any>` — optional environment attributes.

*Returns:*
```ts
{
  allowed: boolean;
  reason: string;
  rule?: ABACRule;
}
```

---

`PermissionEngine.getRules()`

Returns currently loaded ABAC rules.

`PermissionEngine.replaceRules(newRules)`

Replace ABAC rules at runtime.

`PermissionEngine.stop()`

Stops any watchers if ruleSource supports dynamic updates.

---

### Notes
- RBAC roles expand into individual permissions.
- ABAC rules are evaluated after RBAC expansion.
- Deny rules take precedence over allow rules if priorities match.
- Wildcard permissions like posts.* are *not supported yet*.
- The `env` context can include timestamps, IP addresses, or feature flags.

---

## Hot-Reloading Rules
```ts
await engine.replaceRules(await loadRulesFromDB());

engine.on('rules-updated', (newRules) => {
  console.log("Permission rules hot-reloaded");
});
```

The SvelteKit handle hook can update the engine automatically via events or polling.

---

## High-Level API
### Creating the Engine

```ts
import { createPermissionEngine, type RuleSource } from "@ak-network/permkit/server";

export const ruleSource: RuleSource = {
  async load() {
    return await db.getPermissionRules();
  },
  async watch(callback) {
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

### Checking Permissions Server-Side
```ts
const result = await engine.check({
  user,
  permission: "posts:write",
  resource: { ownerId: user.id }
});
```

### Loading Permissions Into locals
```ts
import { handlePermissions } from "@ak-network/permkit/sveltekit/handle";
import { engine } from "$lib/permissions/engine";

export const handle = handlePermissions({ engine });
```

### Route for Permission Checks

`src/routes/__permissions/check/+server.ts`
```ts

import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ allowed: false, reason: "not-logged-in" }), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  }

  const { permission, resource } = await request.json();
  const allowed = await locals.can(permission, resource);

  return new Response(JSON.stringify({ allowed }), {
    headers: { "content-type": "application/json" }
  });
};
```

### Client-Side Permission Checking
```ts
import { permissionStore } from '@ak-network/permkit/client';
export const perms = permissionStore();
```
```ts
if ($perms.can("posts:write", { ownerId: 123 })) {
  // show action
}
```

`<Can>` Component
```html
<Can action="posts:update" {resource}>
  <button>Edit</button>
</Can>
```

---
### Developer Integration Notes
```ts
import { handlePermissions } from "@ak-network/permkit/sveltekit";
import { engine } from "$lib/permissions/engine";

export const handle = handlePermissions({
  engine,
  getUser: async (event) => event.locals.session?.user ?? null,
  getEnv: async (event) => ({
    ip: event.getClientAddress(),
    time: new Date()
  })
});
```
 -->

<!-- 

# PermKit

A lightweight permission engine for **Node.js** and **SvelteKit**, combining:

- **RBAC** (Role-Based Access Control)  
- **PBAC** (Permissions-Based Access Control)  
- **ABAC** (Attribute-Based Access Control)

> ⚠️ **Note:** Wildcard permissions are not supported yet. All permissions must match exactly.

---

## Installation

```bash
npm install @ak-network/permkit
# or
pnpm add @ak-network/permkit
```

---

## Core Concepts

### RBAC (Role-Based Access Control)
- Users have roles.  
- Roles have assigned permissions.

```ts
const roles = {
  admin: ['posts:read', 'posts:write'],
  editor: ['posts:read', 'posts:write'],
  viewer: ['posts:read']
};
```

### PBAC (Permissions-Based Access Control)
- Supports exact permission strings.  
- Can implement wildcard-aware matchers in the future.  
- Async overrides allowed.

```ts
// Example PBAC permission check
const hasPermission = await permissionEngine.check({
  user,
  permission: "posts:write",
  resource: post
});
```

### ABAC (Attribute-Based Access Control)
- Rules are applied based on **attributes of user, resource, and environment**.  
- Rules can **allow or deny** actions.

```ts
const rules = [
  {
    name: 'allow-edit-own-post',
    effect: 'allow',
    priority: 1,
    condition: (ctx) => ctx.user.id === ctx.resource?.ownerId,
  },
  {
    name: 'deny-edit-others-post',
    effect: 'deny',
    priority: 2,
    condition: (ctx) => ctx.user.id !== ctx.resource?.ownerId,
  }
];
```

> ⚠️ Deny rules always take precedence over allow rules when priorities match.

---

## Creating a Permission Engine

```ts
// src/lib/server/permissions.ts
import { createPermissionEngine } from '@ak-network/permkit';

export const permissionEngine = await createPermissionEngine({
  roles: {
    admin: ['posts:read', 'posts:write'],
    editor: ['posts:read', 'posts:write']
  },
  ruleSource: {
    load: async () => rules
  },
  defaultDeny: true
});
```

---

## Checking Permissions in SvelteKit Endpoints

```ts
const result = await permissionEngine.check({
  user: locals.user,
  permission: 'posts:write',
  resource: post
});

if (!result.allowed) return new Response('Forbidden', { status: 403 });
```

---

## Environment-Aware ABAC Example

```ts
const rules = [
  {
    name: 'office-hours-only',
    effect: 'allow',
    priority: 1,
    condition: (ctx) => {
      const hour = ctx.env?.time?.getHours() ?? 0;
      return hour >= 9 && hour <= 17;
    }
  }
];
```

---

## Hot-Reloading Rules

```ts
await engine.replaceRules(await loadRulesFromDB());

engine.on('rules-updated', (newRules) => {
  console.log("Permission rules hot-reloaded");
});
```

---

## `/__permissions/check` Endpoint

This endpoint allows client-side permission checks securely.

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
    headers: { "content-type": "application/json" },
  });
};
```

**Client Usage Example:**

```ts
const res = await fetch('/__permissions/check', {
  method: 'POST',
  body: JSON.stringify({ permission: 'posts:write', resource: { ownerId: 123 } })
});
const { allowed } = await res.json();

if (allowed) {
  // show button or perform action
}
```

> ✅ Returns only whether the action is allowed; internal rules are never exposed.

---

## Client-Side Permission Store

```ts
import { permissionStore } from '@ak-network/permkit/client';
export const perms = permissionStore();
```

```ts
if ($perms.can("posts:write", { ownerId: 123 })) {
  // show action
}
```

### `<Can>` Component

```html
<Can action="posts:update" {resource}>
  <button>Edit</button>
</Can>
```

---

## Developer Integration Notes

```ts
import { handlePermissions } from "@ak-network/permkit/sveltekit";
import { engine } from "$lib/permissions/engine";

export const handle = handlePermissions({
  engine,
  getUser: async (event) => event.locals.session?.user ?? null,
  getEnv: async (event) => ({
    ip: event.getClientAddress(),
    time: new Date()
  })
});
```

---

## Usage Example (Server)

```ts
import { guard } from "@ak-network/permkit/sveltekit";

export const load = guard(
  "posts:write",
  async (event) => ({ secret: "you can edit posts" }),
  (event) => ({ ownerId: event.locals.user?.id })
);
```

---

## License

MIT

 -->

 # 🧩 @ak-network/permkit

A flexible **permission engine** for SvelteKit apps supporting **RBAC**, **PBAC**, and **ABAC**, with hot-reloadable rules and a clean API for server and client.

---

## 🚀 Installation

```bash
pnpm add @ak-network/permkit
```

**Peer dependencies**:

```json
"svelte": "^5.0.0"
```

---

## 💡 Core Concepts

`permkit` supports three permission models:

### **1. RBAC (Role-Based Access Control)**

- Map static roles to permissions:
```ts
const roles = {
  admin: ['posts:read', 'posts:write'],
  editor: ['posts:read', 'posts:write'],
  viewer: ['posts:read']
};
```
- Roles are expanded at login into permissions.

### **2. PBAC (Pattern-Based Access Control)**

- Supports wildcard-aware string matching:
```ts
posts:*          // matches all post permissions
billing:invoice:* // matches all invoice actions
```
- Async overrides allowed if needed.

### **3. ABAC (Attribute-Based Access Control)**

- Async functions with signature:

```ts
condition: async ({ user, resource, env, permission }) => boolean
```

- Declarative JSON rules, prioritized by number (lowest first).  
- Any explicit `deny` short-circuits evaluation.  
- `allow` is returned only if a rule explicitly grants it.

**Example ABAC rules**:

```ts
const rules = [
  {
    name: 'allow-edit-own-post',
    effect: 'allow',
    priority: 1,
    condition: (ctx) => ctx.user.id === ctx.resource?.ownerId,
  },
  {
    name: 'deny-edit-others-post',
    effect: 'deny',
    priority: 2,
    condition: (ctx) => ctx.user.id !== ctx.resource?.ownerId,
  },
  {
    name: 'office-hours-only',
    effect: 'allow',
    priority: 3,
    condition: (ctx) => {
      const hour = ctx.env?.time?.getHours() ?? 0;
      return hour >= 9 && hour <= 17;
    }
  }
];
```

---

## ♻️ Hot-Reloading Rules

```ts
await engine.replaceRules(await loadRulesFromDB());
```

- SvelteKit handle hook can auto-update rules periodically or on events.
- Listen to changes:

```ts
engine.on('rules-updated', (newRules) => {
  console.log("Permission rules hot-reloaded");
});
```

---

## 💻 Server-Side Usage

### **1. Create Engine**

```ts
import { createPermissionEngine } from "@ak-network/permkit/server";
import { db } from "$lib/db";

const engine = await createPermissionEngine({
  roles,
  ruleSource: {
    async load() { return await db.getPermissionRules(); },
    async watch(cb) { db.on("permission_rule_change", cb); }
  },
  defaultDeny: true
});
```

---

### **2. SvelteKit Handle Hook**

```ts
import { handlePermissions } from "@ak-network/permkit/sveltekit/handle";

export const handle = handlePermissions({
  engine,
  getUser: async (event) => event.locals.session?.user ?? null,
  getEnv: async (event) => ({
    ip: event.getClientAddress(),
    time: new Date()
  })
});
```

---

### **3. Permission Check Endpoint**

`src/routes/__permissions/check/+server.ts`:

```ts
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) return new Response(JSON.stringify({ allowed: false, reason: "not-logged-in" }), { status: 200, headers: { "content-type": "application/json" } });
  const { permission, resource } = await request.json();
  const allowed = await locals.can(permission, resource);
  return new Response(JSON.stringify({ allowed }), { headers: { "content-type": "application/json" } });
};
```

---

### **4. Server-Side Guard Example**

```ts
import { guard } from "@ak-network/permkit/sveltekit";

export const load = guard(
  "posts.write",
  async (event) => ({ secret: "you can edit posts" }),
  (event) => ({ ownerId: event.locals.user?.id })
);
```

---

## 🖥 Client-Side Usage

### **1. Permission Store**

```ts
import { permissionStore } from '@ak-network/permkit/client';

export const perms = permissionStore();
```

### **2. Check Permissions**

```ts
if ($perms.can("posts:write", { ownerId: 123 })) {
  // show action
}
```

---

### **3. `<Can>` Component**

```svelte
<Can action="posts:update" {resource}>
  <button>Edit</button>
</Can>
```

---

## 🧠 Developer Notes

- ABAC rules are evaluated **after PBAC/RBAC**, so a matching `allow` in ABAC can override PBAC.  
- Hot-reload supports DB triggers or polling.  
- Use `@internal` for internal types to prevent leaking implementation in docs.

---

## 🧪 Example Rules

```ts
const roles = {
  admin: ['*'],
  editor: ['posts:read', 'posts:write'],
  viewer: ['posts:read']
};

const rules = [
  {
    name: 'allow-edit-own-post',
    effect: 'allow',
    priority: 1,
    condition: (ctx) => ctx.user.id === ctx.resource?.ownerId,
  },
  {
    name: 'deny-edit-others-post',
    effect: 'deny',
    priority: 2,
    condition: (ctx) => ctx.user.id !== ctx.resource?.ownerId,
  }
];
```

---

## ⚖️ License

MIT

---

## 📖 Documentation

- Full API docs are generated via **TypeDoc**:

```bash
pnpm docs:create
```

- Docs are output to `/docs` and categorized: `Shared`, `Server`, `Client`, `Types`.

---
