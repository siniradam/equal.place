<script>
	import CardRoom from '$lib/components/Cards/CardRoom.svelte';
	import SectionTitle from '$lib/components/Parts/SectionTitle.svelte';
	import { channelStore } from '$lib/store';
</script>

<SectionTitle>Rooms</SectionTitle>
{#each Object.keys($channelStore) as channel}
	<CardRoom room={$channelStore[channel]}>{$channelStore[channel].content || channel}</CardRoom>
{/each}
