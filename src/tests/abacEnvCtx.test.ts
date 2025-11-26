import type { ABACRule, PermissionContext } from "../lib/shared/_types.ts";
import { createPermissionEngine } from "../lib/server/engine.ts";
import type { PermissionEngine } from "../lib/server/_engineTypes.ts";
import { describe, it, expect, beforeEach } from "vitest";


describe("ABAC – Environment context", () => {
  let engine: PermissionEngine;

  const rules: ABACRule[] = [
    {
      name: "allow-office-ip",
      effect: "allow",
      priority: 1,
      condition: (ctx: PermissionContext) => {
        // Allow only from a specific IP range
        return ctx.env?.ip === "192.168.1.42";
      }
    },
    {
      name: "feature-flag-enabled",
      effect: "allow",
      priority: 2,
      condition: (ctx: PermissionContext) => {
        // Allow only if a feature flag is enabled
        return ctx.env?.featureFlags?.betaFeature === true;
      }
    },
    {
      name: "deny-all-other-env",
      effect: "deny",
      priority: 99,
      condition: () => true
    }
  ];

  beforeEach(async () => {
    engine = await createPermissionEngine({
      roles: {},        // no RBAC roles for this test
      ruleSource: { load: async () => rules },
      defaultDeny: true
    });
  });

  it("allows access from specific office IP", async () => {
    const result = await engine.check({
      user: { id: "u1" },
      permission: "posts:write",
      env: { ip: "192.168.1.42" }
    });
    expect(result.allowed).toBe(true);
    expect(result.reason).toBe("allow-office-ip");
  });

  it("denies access from other IPs", async () => {
    const result = await engine.check({
      user: { id: "u1" },
      permission: "posts:write",
      env: { ip: "10.0.0.1" }
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("deny-all-other-env");
  });

  it("allows access if beta feature flag is enabled", async () => {
    const result = await engine.check({
      user: { id: "u1" },
      permission: "posts:write",
      env: { featureFlags: { betaFeature: true } }
    });
    expect(result.allowed).toBe(true);
    expect(result.reason).toBe("feature-flag-enabled");
  });

  it("denies access if beta feature flag is disabled", async () => {
    const result = await engine.check({
      user: { id: "u1" },
      permission: "posts:write",
      env: { featureFlags: { betaFeature: false } }
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("deny-all-other-env");
  });
});