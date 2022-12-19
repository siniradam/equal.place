<script>
	// @ts-nocheck
	import Compose from '$lib/components/Compose.svelte';
	import FeedItem from '$lib/components/FeedItem.svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import { userStore, siteStore, contentStore, profilesStore } from '$lib/store';

	let contents = [];
	contentStore.subscribe((d) => {
		contents = d;
	});
</script>

<div class="compose">
	<Compose />
</div>

<SectionTitle>Feed</SectionTitle>
<div class="feed">
	{#each $contentStore as item}
		<FeedItem {item}>
			{item.content}
		</FeedItem>
	{/each}
</div>
