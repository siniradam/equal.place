<script>
	// @ts-nocheck

	//Store
	import { userStore, siteStore, contentStore, profilesStore, channelStore } from '$lib/store';
	//NoSTR
	// import NostrManagerOne from '$lib/libraries/nostr';
	import NostrManager from '$lib/libraries/nostr-manager';

	let pool;

	onMount(() => {
		var db = new PouchDB('my_database');
		window.db = db;

		NostrManager()
			.setNoteHandler((event) => {
				let newContent = [event, ...$contentStore];
				if (newContent.length > 50) {
					newContent.pop();
				}
				// console.log('Total Content:', newContent.length);
				contentStore.set(newContent);
			})
			.setMetaHandler((meta) => {
				let newContent = { ...$profilesStore };
				newContent[meta.pubkey] = meta;
				profilesStore.set(newContent);
			})
			.setChannelCreate((event) => {
				let newContent = { ...$channelStore };
				newContent[event.pubkey] = event;
				channelStore.set(newContent);
			})
			.setProfileUpdate((meta) => {
				userStore.set({ ...$userStore, profile: meta });
			})
			.init()
			.getFeed();
	});

	//Visual
	import Icon from '$lib/components/Icon.svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import '../app.css';
	import { onMount } from 'svelte';

	const menu = [
		{ icon: 'home', selected: true, href: '' },
		{ icon: 'bell', selected: false, href: '' },
		{ icon: 'message', selected: false, href: '' },
		{ icon: 'heart', selected: false, href: '' },
		{ icon: 'user', selected: false, href: '' },
		{ seperator: true },
		{ icon: 'cog', selected: false, href: '' }
	];
</script>

<main>
	<div class="container">
		<header>
			<div class="info" />
			<div class="logo">equal.place</div>
		</header>
		<div class="root">
			<nav>
				{#each menu as menuItem}
					{#if menuItem.seperator}
						<div class="seperator" />
					{:else}
						<button
							class="item {menuItem.selected ? 'selected' : ''}"
							on:click={() => {
								menu.forEach((m) => {
									m.selected = false;
								});
								menuItem.selected = true;
							}}
						>
							<Icon icon={menuItem.icon} solid={menuItem.selected} />
						</button>
					{/if}
				{/each}
				<!-- <div class="item"><Icon icon="bell" /></div>
				<div class="item"><Icon icon="message" /></div>
				<div class="item"><Icon icon="heart" /></div>
				<div class="item"><Icon icon="user" /></div> -->
				<!-- <div class="item"><Icon icon="cog" /></div> -->
			</nav>

			<div class="content">
				<slot />
			</div>
			<div class="sidebar">
				<!-- Search: -->
				<div class="search">
					<input type="text" placeholder="search" />
				</div>
				<!-- /Search -->
				<!-- Side Bar Content -->
				<div class="bar">
					<SectionTitle>Users</SectionTitle>
					{#each Object.keys($profilesStore) as user}
						<div id={user}>@{$profilesStore[user].name}</div>
					{/each}
					<SectionTitle>Rooms</SectionTitle>
					{#each Object.keys($channelStore) as channel}
						<div id={channel}>@{$channelStore[channel].content || channel}</div>
					{/each}
					<SectionTitle>Recently Followed</SectionTitle>
					<SectionTitle>Recent Interactions</SectionTitle>
				</div>

				<!-- /Side Bar Content -->
			</div>
		</div>
	</div>
</main>
