<script>
	import { profilesStore } from '$lib/store';

	export let item;
	let username = $profilesStore[item.pubkey] ? $profilesStore[item.pubkey].name : 'username';
</script>

<div class="contentBlock">
	<!-- Col1 -->
	<div class="col1">
		<div class="avatar" />
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
	</div>
</div>
<!-- 
<small
	>{item.pubkey}
	{item.user != undefined
		? item.user.name
		: $profilesStore[item.pubkey]
		? $profilesStore[item.pubkey].name
		: ''}</small
> -->
