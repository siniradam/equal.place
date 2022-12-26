<script>
	//AVatar
	import { createAvatar } from '@dicebear/avatars';
	import * as styleBots from '@dicebear/avatars-bottts-sprites';

	//Store
	import { userStore, profilesStore } from '$lib/store';

	//SVG Icons
	import Icon from '../Elements/Icon.svelte';
	import { clients } from '$lib/libraries/constants';
	import Reply from './ReplyItem.svelte';
	import ReplyItem from './ReplyItem.svelte';

	// Parameters
	export let item;
	console.log();

	//Component Properties
	let userid = item.user.pubkey;
	let username = userid.substr(0, 25);
	let profilePicture;

	let isReply = !!item.replyTo;

	/** @type {String} */
	let replyId = item.replyTo;
	let seenOn = item.seenOn;

	let showRelays = false;

	$: {
		if ($profilesStore[userid]?.name) {
			username = $profilesStore[userid]?.name;
			if ($profilesStore[userid]?.picture) {
				profilePicture = $profilesStore[userid]?.picture;
			}
		} else {
			if ($userStore.profile.pubkey) {
				userid == $userStore.profile.pubkey;
				if ($userStore.profile) {
					username = $userStore.profile.name;
					profilePicture = $userStore.profile.picture;
				}
			}
		}
	}

	function onError(e) {
		//e.target.setAttribute('crossorigin', 'anonymous');
		//e.target.setAttribute('referrerpolicy', 'no-referrer');
	}
</script>

<div class="contentBlock bg">
	<!-- Col1 -->
	<div class="col1">
		<div class="avatar">
			{#if profilePicture}
				<img id={item.meta.id} src={profilePicture} alt={username} referrerpolicy="no-referrer" />
			{:else}
				{@html createAvatar(styleBots, { seed: userid })}
			{/if}
		</div>
	</div>

	<!-- Col2 -->
	<div class="col2">
		<!-- Row1 -->
		<div class="usermeta">
			<div class="username">{username}</div>
			<div class="pk">{item.user.pubkey}</div>
		</div>

		<!-- Row 2 -->
		<div class="note">
			{#if replyId}
				<ReplyItem {replyId} />
			{/if}
			<slot>
				{@html item.content}
			</slot>
		</div>

		<!-- Row 3 -->
		<div class="actions">
			<button title="Show servers" on:click={() => (showRelays = !showRelays)}>
				<Icon icon="server" /></button
			>
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
		{#if showRelays}
			<div class="servers">
				{#each seenOn as server}
					<div class="info">
						<Icon icon="server" class="h-5" />
						{server}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
