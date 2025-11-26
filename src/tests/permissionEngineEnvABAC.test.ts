import { describe, it, expect, beforeEach } from "vitest";
import { createPermissionEngine } from "../lib/server/engine.ts";
import type { PermissionEngine } from "../lib/server/_engineTypes.ts";
import type { ABACRule } from "../lib/shared/_types.ts";

describe("PermissionEngine – Environment-based ABAC", () => {
  let engine: PermissionEngine;
  let rules: ABACRule[];

  beforeEach(async () => {
    rules = [
      {
        name: "allow-office-ip",
        effect: "allow",
        priority: 1,
        condition: (ctx) => ctx.env?.ip === "10.0.0.1"
      },
      {
        name: "deny-feature-flag-disabled",
        effect: "deny",
        priority: 2,
        condition: (ctx) => ctx.env?.featureFlags?.beta === false
      }
    ];

    engine = await createPermissionEngine({
      roles: {},        // no RBAC roles for this test
      ruleSource: { load: async () => rules },
      defaultDeny: true
    });
  });

  it("allows if the user is from the office IP", async () => {
    const result = await engine.check({
      user: { id: "user1" },
      permission: "posts:write",
      env: { ip: "10.0.0.1" }
    });

    expect(result.allowed).toBe(true);
    expect(result.reason).toBe("allow-office-ip");
  });

  it("denies if a feature flag is disabled", async () => {
    const result = await engine.check({
      user: { id: "user2" },
      permission: "posts:write",
      env: { featureFlags: { beta: false } }
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("deny-feature-flag-disabled");
  });

  it("denies by default if no rules match", async () => {
    const result = await engine.check({
      user: { id: "user3" },
      permission: "posts:write",
      env: { ip: "192.168.1.1", featureFlags: { beta: true } }
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("deny-by-default");
  });
});