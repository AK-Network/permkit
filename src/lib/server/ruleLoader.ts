import type { RuleSource, ABACRule } from "../shared/_types.ts";
import { validateRules } from "./rules.ts";

export class RuleLoader {
  #source: RuleSource;
  #rules: ABACRule[] = [];
  #unsubscribe: (() => void) | null = null;

  constructor(source: RuleSource) {
    this.#source = source;
  }

  async init(onUpdate: (rules: ABACRule[]) => void) {
    const rules = await this.#source.load();
    validateRules(rules);
    this.#rules = rules;
    onUpdate(rules);

    if (this.#source.watch) {
      this.#unsubscribe = this.#source.watch(async () => {
        const updated = await this.#source.load();
        validateRules(updated);
        this.#rules = updated;
        onUpdate(updated);
      }) as (() => void) | null;
    }
  }

  getRules() {
    return this.#rules;
  }

  replaceRules(rules: ABACRule[]) {
    validateRules(rules);
    this.#rules = rules;
  }

  stop() {
    if (this.#unsubscribe) this.#unsubscribe();
  }
}