<script lang="ts">
  let {data} = $props();
  let rules = data.rules;

  let newRule = $state({
    name: "",
    effect: "allow",
    priority: 100,
    condition: "return true;"
  });

  async function createRule() {
		const {condition, ...rest} = newRule;

		const data = {
			condition: condition.trim(),
			...rest,
		};
    await fetch("/admin/rules/api/create", {
      method: "POST",
      body: JSON.stringify(data)
    });
    location.reload();
  }

  async function deleteRule(name: string) {
    await fetch("/admin/rules/api/delete", {
      method: "POST",
      body: JSON.stringify({ name })
    });
    location.reload();
  }
</script>

<h1 class="text-2xl font-bold mb-4">ABAC Rules</h1>

<div class="flex mb-6 space-y-2">
  <input class="input" placeholder="Rule name" bind:value={newRule.name} />
  <select class="input" bind:value={newRule.effect}>
    <option value="allow">allow</option>
    <option value="deny">deny</option>
  </select>
  <input class="input" type="number" bind:value={newRule.priority} />
  <textarea class="input area" rows="1" bind:value={newRule.condition}></textarea>
  <button class="btn" onclick={createRule}>Create Rule</button>
</div>

<table class="table">
  <thead><tr><th>Name</th><th>Effect</th><th>Priority</th><th>Condition</th><th>Action</th></tr></thead>
  <tbody>
    {#each rules as rule}
      <tr>
        <td>{rule.name}</td>
        <td>{rule.effect}</td>
        <td>{rule.priority}</td>
        <td class="max-w-md truncate">{rule.condition}</td>
        <td class="text-center"><button class="btn-red" onclick={() => deleteRule(rule.name)}>Delete</button></td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
	@reference "../../layout.css";

  .input { @apply border p-2 mr-2; &.area { resize: horizontal; } }
  .btn { @apply bg-blue-600 text-white px-3 py-2 rounded; }
  .btn-red { @apply bg-red-600 text-white px-3 py-2 rounded; }
  .table { @apply w-full border-collapse; }
  th, td { @apply border p-2; }
</style>