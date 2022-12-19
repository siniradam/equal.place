<script>
	export let type = '';
	export let solid = false;

	import * as icons from '$lib/icons/icons';

	/**
	 * @type {string}
	 */
	let Icon;
	// export let width = '24px';
	// export let height = '24px';

	if (type == 'home') {
		Icon = solid ? icons.home_solid : icons.home;
	} else if (type == 'bell') {
		Icon = solid ? icons.bell_solid : icons.bell;
	} else if (type == 'chat') {
		Icon = solid ? icons.chat_solid : icons.chat;
	} else if (type == 'message') {
		Icon = solid ? icons.message_solid : icons.message;
	} else if (type == 'cog') {
		Icon = solid ? icons.cog_solid : icons.cog;
	} else if (type == 'heart') {
		Icon = solid ? icons.heart_solid : icons.heart;
	} else if (type == 'user') {
		Icon = solid ? icons.user_solid : icons.user;
	} else {
		Icon = icons.home;
	}
</script>

{@html Icon}
<!-- <img src={Icon} alt="" /> -->
<!-- <svelte:element this="svg" src= /> -->
