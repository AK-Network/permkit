<script lang="ts">
	import type { PageProps } from "./$types.js";

  let {data}: PageProps = $props();
</script>

<h1 class="text-2xl font-bold mb-4">Posts</h1>

<table class="table">
  <thead>
    <tr><th>ID</th><th>Title</th><th>Owner</th></tr>
  </thead>
  <tbody>
    {#each data.posts as post}
      <tr>
        <td>{post.id}</td>
        <td>{post.title}</td>
        <td>{post.ownerId}</td>
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