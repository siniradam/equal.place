<script>
	import { page } from '$app/stores';
	import { menuItems } from '$lib/libraries/constants';
	import { userStore, userStoreDefaultValues } from '$lib/store';
	import Icon from '$lib/components/Elements/Icon.svelte';
	import SectionTitle from '$lib/components/Parts/SectionTitle.svelte';

	const menu = [
		...menuItems,
		{ seperator: true },
		{ icon: 'exit', selected: false, onclick: logout }
	];

	function logout() {
		userStore.set(userStoreDefaultValues);
		localStorage.removeItem('public_key');
		localStorage.removeItem('private_key');
	}
</script>

<nav>
	{#each menu as menuItem}
		{#if menuItem.seperator}
			<div class="seperator" />
		{:else if menuItem.href}
			<a
				href={menuItem.href}
				class="item {$page.route.id == menuItem.href ? 'selected' : ''}"
				on:click={() => {
					menu.forEach((m) => {
						m.selected = false;
					});
					menuItem.selected = true;
				}}
			>
				<Icon icon={menuItem.icon} solid={menuItem.selected} />
			</a>
		{:else}
			<button class="item" on:click={menuItem.onclick}>
				<Icon icon={menuItem.icon} solid={menuItem.selected} />
			</button>
		{/if}
	{/each}
</nav>
