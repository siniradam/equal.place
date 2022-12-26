<script>
	/** @type {String} */
	export let replyId = '';
	let content = '';
</script>

<div class="reply">
	{#if !content}
		<div>REPLY (<a href="#load-#{replyId}">click load reply.</a>)</div>
	{:else}
		{content}
	{/if}
</div>
