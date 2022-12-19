<script>
	// export let room;
	// let date = new Date(room.meta.created_at * 1000).toDateString().split(' ');
	// date.shift();
	let dateLocal = ''; //date.join(' ')
	let room = {};
</script>

<div class="card group">
	<div class="photo" />
	<div class="body">
		<div class="row1">
			<div>{room?.name}</div>
			<div>{dateLocal}</div>
		</div>
		<div class="row2"><slot /></div>
	</div>
</div>
