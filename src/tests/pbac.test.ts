import { describe, it, expect } from "vitest";
import { pbacAllows } from "../lib/shared/pbac.ts";

describe("PBAC wildcard edge cases", () => {
  it("posts:* should match posts:read", () => {
    const result = pbacAllows("posts:read", ["posts:*"]);
    expect(result).toBe(true);
  });

  it("posts:* should match posts:write", () => {
    const result = pbacAllows("posts:write", ["posts:*"]);
    expect(result).toBe(true);
  });

  it("users:* should not match posts:read", () => {
    const result = pbacAllows("posts:read", ["users:*"]);
    expect(result).toBe(false);
  });

  it("* should match any permission", () => {
    const result = pbacAllows("billing:invoice:read", ["*"]);
    expect(result).toBe(true);
  });

  it("exact permission should match itself", () => {
    const result = pbacAllows("posts:read", ["posts:read"]);
    expect(result).toBe(true);
  });

  it("mismatched permission should not match", () => {
    const result = pbacAllows("posts:write", ["billing:*"]);
    expect(result).toBe(false);
  });
});