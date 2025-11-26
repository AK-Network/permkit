<script lang="ts">
	import type { PageProps } from "./$types.js";

  let {data}: PageProps = $props();

  let roles = data.roles;

  let newRole = {
    name: "",
    permissions: ""
  };

  async function createRole() {
    await fetch("/admin/roles/api/create", {
      method: "POST",
      body: JSON.stringify({
        name: newRole.name,
        permissions: newRole.permissions.split(",").map(s => s.trim())
      })
    });

    location.reload();
  }

  async function deleteRole(name: string) {
    await fetch("/admin/roles/api/delete", {
      method: "POST",
      body: JSON.stringify({ name })
    });
    location.reload();
  }
</script>

<h1 class="text-2xl font-bold mb-4">Roles</h1>

<div class="mb-6">
  <input class="input" placeholder="Role name" bind:value={newRole.name} />
  <input class="input" placeholder="permissions (comma separated)" bind:value={newRole.permissions} />
  <button class="btn" onclick={createRole}>Create Role</button>
</div>

<table class="table">
  <thead><tr><th>Name</th><th>Permissions</th><th></th></tr></thead>
  <tbody>
    {#each roles as role}
      <tr>
        <td>{role.name}</td>
        <td>{role.permissions.join(", ")}</td>
        <td>
          <button class="btn-red" onclick={() => deleteRole(role.name)}>Delete</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>



<style>
	@reference "../../layout.css";

  .input { @apply border p-2 mr-2; }
  .btn { @apply bg-blue-600 text-white px-3 py-2 rounded; }
  .btn-red { @apply bg-red-600 text-white px-3 py-2 rounded; }
  .table { @apply w-full border-collapse; }
  th, td { @apply border p-2; }
</style>