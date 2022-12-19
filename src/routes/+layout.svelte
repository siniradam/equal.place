<script>
	// @ts-nocheck

	//Store
	import { userStore, siteStore, contentStore, profilesStore, channelStore } from '$lib/store';
	import { page } from '$app/stores';

	//NoSTR
	// import NostrManagerOne from '$lib/libraries/nostr';
	import NostrManager from '$lib/libraries/nostr-manager';

	let currentUrl = '';

	onMount(() => {
		// var db = new PouchDB('my_database');
		// window.db = db;

		console.log(window.location.href);

		NostrManager()
			.setNoteHandler((event) => {
				let newContent = [event, ...$contentStore];
				if (newContent.length > 150) {
					newContent.pop();
				}
				// console.log('Total Content:', newContent.length);
				contentStore.set(newContent);
			})
			.setMetaHandler((meta) => {
				let newContent = {};
				newContent[meta.pubkey] = meta;
				newContent = { ...newContent, ...$profilesStore };
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
	import CardRoom from '$lib/components/CardRoom.svelte';
	import CardUser from '$lib/components/CardUser.svelte';

	const menu = [
		{ icon: 'home', selected: $page.route.id == '/', href: '/' },
		{ icon: 'bell', selected: $page.route.id == '/notifications', href: '/notifications' },
		{ icon: 'message', selected: $page.route.id == '/messages', href: '/messages' },
		{ icon: 'heart', selected: $page.route.id == '/bookmarks', href: '/bookmarks' },
		{ icon: 'user', selected: $page.route.id == '/profile', href: '/profile' },
		{ seperator: true },
		{ icon: 'cog', selected: $page.route.id == '/settings', href: '/settings' }
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
						<a
							href={menuItem.href}
							class="item {menuItem.selected ? 'selected' : ''}"
							on:click={() => {
								menu.forEach((m) => {
									m.selected = false;
								});
								menuItem.selected = true;
							}}
						>
							<Icon icon={menuItem.icon} solid={menuItem.selected} />
						</a>
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
					<SectionTitle>Fetched Users</SectionTitle>
					<div class="list">
						{#each Object.keys($profilesStore).slice(0, 15) as uid}
							<CardUser user={$profilesStore[uid]}>{uid}</CardUser>
						{/each}
					</div>
					<SectionTitle>Rooms</SectionTitle>
					{#each Object.keys($channelStore) as channel}
						<CardRoom>@{$channelStore[channel].content || channel}</CardRoom>
					{/each}
					<SectionTitle>Recently Followed</SectionTitle>
					<SectionTitle>Recent Interactions</SectionTitle>
				</div>

				<!-- /Side Bar Content -->
			</div>
		</div>
	</div>
</main>
