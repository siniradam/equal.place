<script>
	import SectionTitle from './SectionTitle.svelte';
	import { profilesStore } from '$lib/store';
	import CardUser from '$lib/components/Cards/CardUser.svelte';
</script>

<SectionTitle>Last Fetched User</SectionTitle>
<div class="list">
	{#each Object.keys($profilesStore).slice(0, 1) as uid}
		<CardUser user={$profilesStore[uid]}>{uid}</CardUser>
	{/each}
</div>
