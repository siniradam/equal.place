<script>
	import { createAvatar } from '@dicebear/avatars';
	import * as styleBots from '@dicebear/avatars-bottts-sprites';
	import * as styleMicah from '@dicebear/micah';
	import { dateString } from '$lib/libraries/utils';

	export let user;
	let dateLocal = dateString(user.meta.created_at);
</script>

<div class="card user">
	<div class="photo">
		{#if user.photo}
			<img src={user.photo} alt={user.pubkey} />
		{:else}
			{@html createAvatar(styleBots, { seed: user.pubkey })}
		{/if}
	</div>
	<div class="body">
		<div class="row1">
			<div>{user?.name}</div>
			<div>{dateLocal}</div>
		</div>
		<div class="row2 pk"><slot /></div>
	</div>
</div>
