<script>
	import { identicon } from '$lib/libraries/avatar';
	import { dateString } from '$lib/libraries/utils';

	export let room = {};
	let dateLocal = dateString(room.created_at);
</script>

<div class="card group">
	<div class="photo">
		{@html identicon(room.pubkey)}
	</div>
	<div class="body">
		<div class="row1">
			<div>{room?.name ? room?.name : ''}</div>
			<div>{dateLocal}</div>
		</div>
		<div class="row2 pk"><slot /></div>
	</div>
</div>
