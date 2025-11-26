import { describe, it, expect } from "vitest";
import { createPermissionEngine } from "../lib/server/engine.ts";
import type { RuleSource, ABACRule, PermissionContext } from "../lib/shared/_types.ts";

// ---- Helpers ----

function makeEngine({
  roles = {},
  rules = [],
  defaultDeny = true
}: {
  roles?: Record<string, string[]>;
  rules?: ABACRule[];
  defaultDeny?: boolean;
}) {
  const ruleSource: RuleSource = {
    load: async () => rules,
  };

  return createPermissionEngine({
    roles,
    ruleSource,
    defaultDeny
  });
}

// ------------------------------
// BASIC: allow / deny
// ------------------------------

describe("PermissionEngine – basic ABAC allow/deny", () => {
  it("allows when an allow rule matches", async () => {
    const rule: ABACRule = {
      name: "allow-read",
      effect: "allow",
      priority: 10,
      condition: (ctx) => ctx.permission === "posts:read"
    };

    const engine = await makeEngine({ rules: [rule] });

    const result = await engine.check({
      user: { id: "u1" },
      permission: "posts:read"
    });

    expect(result.allowed).toBe(true);
    expect(result.reason).toBe("allow-read");
    expect(result.rule!.name).toBe("allow-read");
  });

  it("denies when a deny rule matches", async () => {
    const rule: ABACRule = {
      name: "deny-delete",
      effect: "deny",
      priority: 5,
      condition: (ctx) => ctx.permission === "posts:delete"
    };

    const engine = await makeEngine({ rules: [rule] });

    const result = await engine.check({
      user: { id: "u1" },
      permission: "posts:delete"
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("deny-delete");
    expect(result.rule!.name).toBe("deny-delete");
  });
});

// ------------------------------
// PRIORITY
// ------------------------------

describe("PermissionEngine – priority ordering", () => {
  it("applies the lowest priority rule first", async () => {
    const allow: ABACRule = {
      name: "late-allow",
      effect: "allow",
      priority: 100,
      condition: () => true,
    };

    const deny: ABACRule = {
      name: "early-deny",
      effect: "deny",
      priority: 1,
      condition: () => true
    };

    const engine = await makeEngine({ rules: [allow, deny] });

    const result = await engine.check({
      user: { id: "u1" },
      permission: "anything"
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("early-deny");
  });
});

// ------------------------------
// DENY-BY-DEFAULT
// ------------------------------

describe("PermissionEngine – deny-by-default", () => {
  it("denies if no rules match and defaultDeny=true", async () => {
    const engine = await makeEngine({ defaultDeny: true });

    const result = await engine.check({
      user: { id: "u1" },
      permission: "unknown.action"
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("deny-by-default");
  });

  it("allows if no rules match and defaultDeny=false", async () => {
    const engine = await makeEngine({ defaultDeny: false });

    const result = await engine.check({
      user: { id: "u1" },
      permission: "unknown.action"
    });

    expect(result.allowed).toBe(true);
    expect(result.reason).toBe("no-rule-match");
  });
});

// ------------------------------
// RBAC + PBAC
// ------------------------------

describe("PermissionEngine – RBAC role expansion", () => {
  it("grants permissions inherited from roles (PBAC)", async () => {
    const roles = {
      editor: ["posts:read", "posts:write"]
    };

    const engine = await makeEngine({ roles });

    const result = await engine.check({
      user: { id: "u1", roles: ["editor"] },
      permission: "posts:write"
    });

    expect(result.allowed).toBe(true);
    expect(result.reason).toBe("no-rule-match"); // no ABAC rule needed
  });

  it("combines user.permissions with role permissions", async () => {
    const roles = {
      editor: ["posts:read"]
    };

    const engine = await makeEngine({ roles });

    const result = await engine.check({
      user: {
        id: "u1",
        roles: ["editor"],
        permissions: ["posts:delete"]
      },
      permission: "posts:delete"
    });

    expect(result.allowed).toBe(true);
    expect(result.reason).toBe("no-rule-match");
  });
});

// ------------------------------
// RESOURCE-BASED ABAC
// ------------------------------

describe("PermissionEngine – resource rules", () => {
  it("allows editing own post", async () => {
    const rule: ABACRule = {
      name: "edit-own",
      effect: "allow",
      priority: 10,
      condition: (ctx) =>
        ctx.permission === "posts:edit" &&
        ctx.resource?.ownerId === ctx.user.id
    };

    const engine = await makeEngine({ rules: [rule] });

    const result = await engine.check({
      user: { id: "u1" },
      permission: "posts:edit",
      resource: { ownerId: "u1" }
    });

    expect(result.allowed).toBe(true);
    expect(result.reason).toBe("edit-own");
  });

  it("denies editing someone else's post", async () => {
    const rule: ABACRule = {
      name: "edit-own",
      effect: "allow",
      priority: 10,
      condition: (ctx) =>
        ctx.permission === "posts:edit" &&
        ctx.resource?.ownerId === ctx.user.id
    };

    const engine = await makeEngine({ rules: [rule] });

    const result = await engine.check({
      user: { id: "u1" },
      permission: "posts:edit",
      resource: { ownerId: "u2" }
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("deny-by-default");
  });
});

// ------------------------------
// ASYNC RULES
// ------------------------------

describe("PermissionEngine – async ABAC rules", () => {
  it("supports async conditions", async () => {
    const rule: ABACRule = {
      name: "async-allow",
      effect: "allow",
      priority: 10,
      condition: async () => {
        await new Promise((r) => setTimeout(r, 5));
        return true;
      }
    };

    const engine = await makeEngine({ rules: [rule] });

    const result = await engine.check({
      user: { id: "u1" },
      permission: "x"
    });

    expect(result.allowed).toBe(true);
    expect(result.reason).toBe("async-allow");
  });
});