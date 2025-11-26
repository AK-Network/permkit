<script>

	// import { Can } from "@ak-network/permkit"
  import Can from "../../lib/client/components/Can.svelte";

  let {data} = $props();
</script>

<div class="grid gap-4 p-4">
{#each data.posts as post}
	
	{post.id}
	<div class="card">
		<h2>{post.title}</h2>
		<p>{post.content}</p>
	</div>
	
	<Can action="posts:write" resource={post._id}>
		<button>Edit Post</button>
	</Can>
{/each}

</div>



<style>

	@reference "../layout.css";

	.card {
		 @apply border p-2 mr-2;
	}
</style>