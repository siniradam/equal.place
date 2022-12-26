<script>
	// @ts-nocheck
	import Compose from '$lib/components/Blocks/Compose.svelte';
	import FeedItem from '$lib/components/Blocks/FeedItem.svelte';
	import SectionTitle from '$lib/components/Parts/SectionTitle.svelte';
	import { userStore, siteStore, contentStore, profilesStore } from '$lib/store';

	let currentFeedView = 'global';

	let contents = [];
	contentStore.subscribe((d) => {
		contents = d;
	});
</script>

<div class="compose">
	<Compose />
</div>

<SectionTitle>
	<button class:passive={currentFeedView != 'feed'}>Feed</button>
	<button class:passive={currentFeedView != 'global'}>Global</button>
</SectionTitle>
<div class="feed">
	{#if $siteStore.unread}
		<div>Load {$siteStore.unread > 50 ? '50' : $siteStore.unread} more</div>
	{/if}
	{#each Object.entries($contentStore) as [id, item]}
		<FeedItem {item} />
	{/each}
</div>
