<script>
	let classes = '';
	export { classes as class };

	export let checked = true;
	export let onChange = (status) => {};

	function toggle() {
		checked = !checked;
		onChange(checked);
	}
</script>

<div class="slider {checked ? 'checked' : ''} {classes}" on:click={toggle} on:keydown={toggle}>
	<div class="knob" />
</div>
