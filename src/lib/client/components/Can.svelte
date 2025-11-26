<script lang="ts">
	import type { Snippet } from "svelte";
  import permissions from "../store.ts";

	let {action, resource = undefined, children}: {
		action: string
		resource: any
		children: Snippet
	} = $props();

  let allowed = $state(false);

	$effect(() => { ( async () => check() )() })

  async function check() {
    allowed = await permissions.can(action, resource);
  }
</script>

{#if allowed}
  {@render children?.()}
{/if}