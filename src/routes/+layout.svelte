<script>
	// @ts-nocheck

	//Store
	import { userStore, siteStore, contentStore, profilesStore, channelStore } from '$lib/store';
	import { page } from '$app/stores';

	//NoSTR
	// import NostrManagerOne from '$lib/libraries/nostr';
	import NostrManager from '$lib/libraries/nostr-manager';

	let currentUrl = '';
	let pubkey;

	function setPublicKeyInStore(justKey) {
		let uStore = { ...$userStore };
		uStore.keys.public = justKey;
		userStore.set(uStore);
	}

	function init(key) {
		NostrManager(key)
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
	}

	function logout() {
		userStore.set({ profile: {}, keys: {} });
	}

	onMount(() => {
		pubkey = localStorage.getItem('public_key');

		if (pubkey) {
			setPublicKeyInStore(pubkey);
			init(pubkey);
		}

		if ($userStore.keys.public) {
		} else {
			console.log('No public key have been found.');
		}
	});

	//Visual
	import Icon from '$lib/components/Icon.svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import '../app.css';
	import { onMount } from 'svelte';
	import CardRoom from '$lib/components/CardRoom.svelte';
	import CardUser from '$lib/components/CardUser.svelte';
	import Slider from '$lib/components/Slider.svelte';
	import AuthForm from '$lib/components/AuthForm.svelte';

	const menu = [
		{ icon: 'home', selected: $page.route.id == '/', href: '/' },
		{ icon: 'bell', selected: $page.route.id == '/notifications', href: '/notifications' },
		{ icon: 'message', selected: $page.route.id == '/messages', href: '/messages' },
		{ icon: 'heart', selected: $page.route.id == '/bookmarks', href: '/bookmarks' },
		{ icon: 'user', selected: $page.route.id == '/profile', href: '/profile' },
		{ icon: 'cog', selected: $page.route.id == '/settings', href: '/settings' },
		{ seperator: true },
		{ icon: 'exit', selected: $page.route.id == '', onclick: logout }
	];
</script>

<main>
	<div class="container">
		<header>
			<div class="info" />
			<div class="logo">equal.place</div>
		</header>
		<div class="root">
			{#if $userStore.keys.public}
				<nav>
					{#each menu as menuItem}
						{#if menuItem.seperator}
							<div class="seperator" />
						{:else if menuItem.href}
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
						{:else}
							<button
								class="item {menuItem.selected ? 'selected' : ''}"
								on:click={menuItem.onclick}
							>
								<Icon icon={menuItem.icon} solid={menuItem.selected} />
							</button>
						{/if}
					{/each}
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
						<!-- <SectionTitle>Recently Followed</SectionTitle> -->
						<!-- <SectionTitle>Recent Interactions</SectionTitle> -->
					</div>

					<!-- /Side Bar Content -->
				</div>
			{:else}
				<AuthForm />
			{/if}
		</div>
	</div>
</main>
