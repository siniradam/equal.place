<script>
	export let user;
	let date = new Date(user.meta.created_at * 1000).toDateString().split(' ');
	date.shift();
	let dateLocal = date.join(' ');
</script>

<div class="card user">
	<div class="photo" />
	<div class="body">
		<div class="row1">
			<div>{user?.name}</div>
			<div>{dateLocal}</div>
		</div>
		<div class="row2 pk"><slot /></div>
	</div>
</div>
