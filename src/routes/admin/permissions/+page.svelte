<script lang="ts">
  import { onMount } from "svelte";
  // import type { ABACRule } from "@ak-network/permkit";
  import type { ABACRule } from "../../../lib/index.ts";

  let rules: ABACRule[] = [];
  let newRule: Partial<ABACRule> = { effect: "allow", priority: 10 };

  async function loadRules() {
    const res = await fetch("/api/rules");
    rules = await res.json();
  }

  async function saveRule() {
    await fetch("/api/rules", {
      method: "POST",
      body: JSON.stringify(newRule),
      headers: { "content-type": "application/json" }
    });
    await loadRules();
  }

  onMount(loadRules);
</script>

<div class="p-6">
  <h2 class="text-xl font-bold">Permission Builder</h2>

  <div class="mt-4 space-y-2">
    <input type="text" bind:value={newRule.name} placeholder="Rule Name" class="input" />
    <select bind:value={newRule.effect} class="input">
      <option value="allow">Allow</option>
      <option value="deny">Deny</option>
    </select>
    <input type="number" bind:value={newRule.priority} placeholder="Priority" class="input" />
    <textarea bind:value={newRule.condition} placeholder="Condition function (ctx)" class="input"></textarea>
    <button class="btn" on:click={saveRule}>Save Rule</button>
  </div>

  <ul class="mt-6 space-y-1">
    {#each rules as r}
      <li>{r.name} — {r.effect} — priority {r.priority}</li>
    {/each}
  </ul>
</div>

<style>
.input { border: 1px solid #ccc; padding: 0.5rem; width: 100%; }
.btn { background: #0070f3; color: white; padding: 0.5rem 1rem; border-radius: 0.25rem; }
</style>