<script>
	import { createAvatar } from '@dicebear/avatars';
	import * as styleBots from '@dicebear/avatars-bottts-sprites';

	import { identicon } from '$lib/libraries/avatar';
	import { profilesStore } from '$lib/store';
	import Icon from './Icon.svelte';
	export let item;
	let username = item.pubkey.substr(0, 25);

	$: {
		if ($profilesStore[item.pubkey]?.name) {
			username = $profilesStore[item.pubkey]?.name;
		}
	}
</script>

<div class="contentBlock">
	<!-- Col1 -->
	<div class="col1">
		<div class="avatar">
			{#if $profilesStore[item.pubkey]?.picture}
				<img
					src={$profilesStore[item.pubkey].picture}
					alt={$profilesStore[item.pubkey].name}
					rel="noreferrer"
				/>
			{:else}
				{@html createAvatar(styleBots, { seed: item.pubkey })}
			{/if}
		</div>
	</div>

	<!-- Col2 -->
	<div class="col2">
		<!-- Row1 -->
		<div class="usermeta">
			<div class="username">{username}</div>
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
