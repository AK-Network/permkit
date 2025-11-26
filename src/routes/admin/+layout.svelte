<script lang="ts">
	import type { LayoutProps } from "./$types.js";

  let { data, children }: LayoutProps = $props();
</script>

<div class="min-h-screen flex">
  <aside class="w-64 bg-gray-900 text-white p-4">
    <h2 class="text-xl font-bold mb-4">Admin Panel</h2>
    <nav class="space-y-2">
      <a href="/admin" class="block">Dashboard</a>
      <a href="/admin/users" class="block">Users</a>
      <a href="/admin/roles" class="block">Roles</a>
      <a href="/admin/posts" class="block">Posts</a>
      <a href="/admin/rules" class="block">ABAC Rules</a>
    </nav>
  </aside>

  <main class="flex-1 p-6 bg-gray-50">
    {@render children?.()}
  </main>
</div>