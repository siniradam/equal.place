<script>
	// @ts-nocheck

	//Store
	import {
		userStore,
		siteStore,
		contentStore,
		profilesStore,
		channelStore,
		userStoreDefaultValues
	} from '$lib/store';

	import { page } from '$app/stores';

	//Visual
	import Icon from '$lib/components/Icon.svelte';
	import SectionTitle from '$lib/components/SectionTitle.svelte';
	import '../app.css';
	import { onMount } from 'svelte';
	import CardRoom from '$lib/components/CardRoom.svelte';
	import CardUser from '$lib/components/CardUser.svelte';
	import AuthForm from '$lib/components/AuthForm.svelte';

	//NoSTR
	import NostrManager from '$lib/libraries/nostr-manager';
	import { db } from '$lib/db';
	import { menuItems } from '$lib/libraries/constants';

	let database; //db Reference
	let pubkey; //loggedin user key reference
	let isInitiated = false; //Is started. (this is here to prevent a bug. I shouldn't need this.)

	function setPublicKeyInStore(justKey) {
		let uStore = { ...$userStore };
		uStore.keys.public = justKey;
		userStore.set(uStore);
		console.log('Logging out.');
	}

	function logout() {
		userStore.set(userStoreDefaultValues);
		localStorage.removeItem('public_key');
		localStorage.removeItem('private_key');
	}

	function init(key) {
		NostrManager(key)
			.setNoteHandler((note) => {
				let newContent = [note, ...$contentStore];
				// if (newContent.length > 150) {
				// 	newContent.pop();
				// }
				contentStore.set(newContent);
			})
			.setMetaHandler((meta) => {
				let newContent = {};
				newContent[meta.pubkey] = meta;
				newContent = { ...newContent, ...$profilesStore };
				profilesStore.set(newContent);
				// console.log(meta);
				database.addProfile(meta);
			})
			.setChannelCreate((event) => {
				let newContent = { ...$channelStore };
				newContent[event.pubkey] = event;
				channelStore.set(newContent);
			})
			.setProfileUpdate((meta) => {
				userStore.set({ ...$userStore, profile: meta });
			})
			.setExternalProfileReference((pubkey) => database.getProfile(pubkey))
			.init()
			.getFeed();
	}

	$: {
		pubkey = $userStore.keys.public;
		if (pubkey && !isInitiated) {
			isInitiated = true;
			init(pubkey);
		}
	}

	onMount(async () => {
		database = await db();
		if ($userStore.keys.public) {
			console.log('Key found.');
		} else {
			console.log('No public key have been found.');
		}
	});

	const menu = [
		...menuItems,
		{ seperator: true },
		{ icon: 'exit', selected: false, onclick: logout }
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
				<div class="nav">
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
				</div>

				<div class="content">
					<slot />
					<div class="footer-info">
						<p>Made with ❤️</p>
						<a href="https://github.com/siniradam/equal.place">
							<img
								src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white"
								alt="See it on Github"
							/>
						</a>

						<!-- (https://img.shields.io/github/stars/siniradam/equal.place.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/siniradam/equal.place/stargazers/) -->
					</div>
				</div>
				<div class="sidebar">
					<!-- Search: -->
					<div class="search">
						<input type="text" placeholder="search" />
					</div>
					<!-- /Search -->
					<!-- Side Bar Content -->
					<div class="bar">
						<SectionTitle>Last Fetched User</SectionTitle>
						<div class="list">
							{#each Object.keys($profilesStore).slice(0, 1) as uid}
								<CardUser user={$profilesStore[uid]}>{uid}</CardUser>
							{/each}
						</div>
						<SectionTitle>Rooms</SectionTitle>
						{#each Object.keys($channelStore) as channel}
							<CardRoom room={$channelStore[channel]}
								>{$channelStore[channel].content || channel}</CardRoom
							>
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
