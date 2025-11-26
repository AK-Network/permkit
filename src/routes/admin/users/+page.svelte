<script lang="ts">
	import type { PageProps } from "./$types.js";

  let {data}: PageProps = $props();
  let users = data.users;

  let newUser = {
    _id: "",
    email: "",
    roles: []
  };

  async function createUser() {
    await fetch("/admin/users/api/create", {
      method: "POST",
      body: JSON.stringify(newUser)
    });
    location.reload();
  }

  async function deleteUser(id: string) {
    await fetch("/admin/users/api/delete", {
      method: "POST",
      body: JSON.stringify({ id })
    });
    location.reload();
  }
</script>

<h1 class="text-2xl font-bold mb-4">Users</h1>

<div class="mb-6">
  <h2 class="font-semibold mb-2">Create User</h2>
  <input class="input" placeholder="ID" bind:value={newUser._id} />
  <input class="input" placeholder="Email" bind:value={newUser.email} />
  <button class="btn" onclick={createUser}>Create User</button>
</div>

<table class="table">
  <thead><tr><th>ID</th><th>Email</th><th>Roles</th><th></th></tr></thead>
  <tbody>
    {#each users as user}
      <tr>
        <td>{user._id}</td>
        <td>{user.email}</td>
        <td>{user.roles?.join(", ")}</td>
        <td>
          <button class="btn-red" onclick={() => deleteUser(user._id.toString())}>Delete</button>
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