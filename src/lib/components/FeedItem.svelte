<script>
	import { profilesStore } from '$lib/store';
	import Icon from './Icon.svelte';

	export let item;
</script>

<div class="contentBlock">
	<!-- Col1 -->
	<div class="col1">
		<div class="avatar">
			{#if $profilesStore[item.pubkey]?.picture}
				<img src={$profilesStore[item.pubkey].picture} alt={$profilesStore[item.pubkey].name} />
			{/if}
		</div>
	</div>

	<!-- Col2 -->
	<div class="col2">
		<!-- Row1 -->
		<div class="usermeta">
			<div class="username">{$profilesStore[item.pubkey]?.name}</div>
			<div class="pk">{item.pubkey}</div>
		</div>

		<!-- Row 2 -->
		<div class="note"><slot /></div>

		<!-- Row 3 -->
		<div class="actions">
			<button class="text-like">
				<Icon icon="heart" />
			</button>
			<button class="text-actionOne">
				<Icon icon="reply" />
			</button>
		</div>
	</div>
</div>
