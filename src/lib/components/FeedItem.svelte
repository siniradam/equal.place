<script>
	//AVatar
	import { createAvatar } from '@dicebear/avatars';
	import * as styleBots from '@dicebear/avatars-bottts-sprites';

	//Store
	import { profilesStore } from '$lib/store';

	//SVG Icons
	import Icon from './Icon.svelte';
	import { clients } from '$lib/libraries/constants';

	//Component Properties
	export let item;

	let username = item.pubkey.substr(0, 25);
	let profilePicture;

	$: {
		if ($profilesStore[item.pubkey]?.name) {
			username = $profilesStore[item.pubkey]?.name;
			if ($profilesStore[item.pubkey]?.picture) {
				profilePicture = $profilesStore[item.pubkey]?.picture;
			}
		}
	}

	function onError(e) {
		//e.target.setAttribute('crossorigin', 'anonymous');
		//e.target.setAttribute('referrerpolicy', 'no-referrer');
	}

	console.log(item.client);
</script>

<div class="contentBlock">
	<!-- Col1 -->
	<div class="col1">
		<div class="avatar">
			{#if profilePicture}
				<img id={item.meta.id} src={profilePicture} alt={username} referrerpolicy="no-referrer" />
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
			{#if item.client}
				<div class="icon">
					<img src={clients?.[item.client] || 'unkown'} alt={`sent via ${item.client} client`} />
				</div>
			{/if}
		</div>
	</div>
</div>
