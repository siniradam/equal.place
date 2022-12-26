<script>
	import CardRoom from '$lib/components/Cards/CardRoom.svelte';
	import SectionTitle from '$lib/components/Parts/SectionTitle.svelte';
	import { channelStore } from '$lib/store';

	//{$channelStore[channel].content || channel}
</script>

<SectionTitle>Rooms</SectionTitle>
{#each Object.keys($channelStore) as channel}
	<CardRoom room={$channelStore[channel]} />
{/each}
