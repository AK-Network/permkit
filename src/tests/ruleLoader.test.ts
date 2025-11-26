import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { startTestMongo, stopTestMongo } from "./setup/mongo.ts";

import { RuleLoader } from "../lib/server/ruleLoader.ts"
import type { RuleSource, ABACRule } from "../lib/shared/_types.ts";


describe("RuleLoader", () => {
  
  it("loads initial rules from source", async () => {
    const initialRules: ABACRule[] = [
      {
        name: "allow-read",
        effect: "allow",
        priority: 10,
        condition:  (ctx) => ctx.permission === "read"
      }
    ];

    const mockSource: RuleSource = {
      load: vi.fn(async () => initialRules)
    };

    const loader = new RuleLoader(mockSource);

    let loaded: ABACRule[] = [];
    await loader.init((rules) => {
      loaded = rules;
    });

    expect(mockSource.load).toHaveBeenCalled();
    expect(loaded).toEqual(initialRules);
    expect(loader.getRules()).toEqual(initialRules);
  });

  it("reacts to watch() updates", async () => {
    const first: ABACRule[] = [
      { name: "rule1", effect: "allow", priority: 10, condition: () => true }
    ];
    const next: ABACRule[] = [
      { name: "rule2", effect: "deny", priority: 1, condition: () => true }
    ];

    let watchCallback: (() => void) | null = null;

    const mockSource: RuleSource = {
      load: vi.fn()
        .mockResolvedValueOnce(first)  // first init load
        .mockResolvedValueOnce(next),  // second load triggered by watch
      watch: (onChange) => {
        watchCallback = onChange;
        return () => {}; // unsubscribe
      }
    };

    const loader = new RuleLoader(mockSource);

    let updates: ABACRule[][] = [];
    await loader.init((rules) => {
      updates.push(rules);
    });

    // trigger watch update
    await watchCallback!();

    expect(updates.length).toBe(2); // initial + after watch
    expect(updates[0]).toEqual(first);
    expect(updates[1]).toEqual(next);
    expect(loader.getRules()).toEqual(next);
  });

  it("replaces rules manually", () => {
    const mockSource: RuleSource = { load: async () => [] };
    const loader = new RuleLoader(mockSource);

    const newRules: ABACRule[] = [
      { name: "manual", effect: "allow", priority: 2, condition: () => true }
    ];

    loader.replaceRules(newRules);

    expect(loader.getRules()).toEqual(newRules);
  });

  it("calls unsubscribe when stopping", async () => {
    const unsubscribe = vi.fn();

    const mockSource: RuleSource = {
      load: async () => [],
      watch: () => unsubscribe
    };

    const loader = new RuleLoader(mockSource);

    await loader.init(() => {});
    loader.stop();

    expect(unsubscribe).toHaveBeenCalled();
  });

});