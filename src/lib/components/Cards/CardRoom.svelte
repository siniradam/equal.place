<script>
	import { identicon } from '$lib/libraries/avatar';
	import { dateString } from '$lib/libraries/utils';

	export let room = {};
	let dateLocal = dateString(room.created_at);
</script>

<div class="cardmini group">
	<div class="photo">
		{@html identicon(room.pubkey)}
	</div>
	<div class="body">
		<div class="row1">
			<div>{room?.name ? room.name : room.pubkey}</div>
			<div>{dateLocal}</div>
		</div>
	</div>
</div>
