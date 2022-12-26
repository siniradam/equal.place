<script>
	// @ts-nocheck

	//Store
	import { userStore, siteStore, contentStore, profilesStore, channelStore } from '$lib/store';

	//Visual
	import '../app.css';
	import { onMount } from 'svelte';
	import AuthForm from '$lib/components/Blocks/AuthForm.svelte';

	//NoSTR
	// import NostrManager from '$lib/libraries/nostr-manager';
	import NostrManager from '$lib/libraries/nostr-manager2';
	import { db } from '$lib/db';

	//Components
	import BarLastUser from '$lib/components/Parts/BarLastUser.svelte';
	import BarRooms from '../lib/components/Parts/BarRooms.svelte';
	import BarServers from '$lib/components/Parts/BarServers.svelte';
	import Nav from '$lib/components/Parts/Nav.svelte';
	import Footer from '$lib/components/Parts/Footer.svelte';

	let database; //db Reference
	let pubkey; //loggedin user key reference
	let isInitiated = false; //Is started. (this is here to prevent a bug. I shouldn't need this.)

	// function setPublicKeyInStore(justKey) {
	// 	let uStore = { ...$userStore };
	// 	uStore.keys.public = justKey;
	// 	userStore.set(uStore);
	// 	console.log('Logging out.');
	// }

	// const onMetaReceived = (meta) => {
	// 	let newContent = {};
	// 	newContent[meta.pubkey] = meta;
	// 	newContent = { ...newContent, ...$profilesStore };
	// 	profilesStore.set(newContent);
	// 	// console.log(meta);
	// 	database.addProfile(meta);
	// };

	// const metaHandler = (meta) => {
	// 	userStore.set({ ...$userStore, profile: meta });
	// };

	const onRelayConnected = (name, address, status) => {
		let newSiteStore = { ...$siteStore };
		newSiteStore.connectedRelays.push(address);
		newSiteStore.connectedRelays = [...new Set([...newSiteStore.connectedRelays])];
		siteStore.set(newSiteStore);
	};

	const userProfileHandler = (data) => {
		// console.log('Profile received.');
		userStore.set({ ...$userStore, profile: data.profile });
	};

	const noteHandler = (note) => {
		if (Object.keys($contentStore).length < 10) {
			addNoteToStore(note);
		} else {
			siteStore.set({ $siteStore, unreadNote: $siteStore.unreadNote + 1 });
		}
	};

	const addNoteToStore = (note) => {
		if ($channelStore[note.id]) {
			let originalNote = $channelStore[note.id];
			//Update new record;
			note.seenOn = [...new Set(...note.seenOn, ...originalNote.seenOn)];
		}

		//Think later.
		// let updatedStore = { ...$contentStore };
		// updatedStore[note.id] = note

		// if (Object.keys(updatedStore).length > 150) {
		// 	let lastElementId = Object.keys(x).slice(-1)[0];
		// 	delete updatedStore[lastElementId];
		// }

		contentStore.set({ ...$contentStore, [note.id]: note });
	};

	$: {
		pubkey = $userStore.keys.public;
		if (pubkey && !isInitiated) {
			isInitiated = true;
			NostrManager(pubkey)
				.on('note', noteHandler)
				.on('connect', onRelayConnected)
				.on('profile', userProfileHandler)
				.init();
			// init(pubkey);
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
					<Nav />
				</div>
				<div class="content">
					<slot />
					<Footer />
				</div>
				<div class="sidebar">
					<!-- Search: -->
					<div class="search">
						<input type="text" placeholder="search" />
					</div>
					<!-- /Search -->

					<!-- Side Bar Content -->
					<div class="bar">
						<BarServers />
						<!-- <BarLastUser /> -->
						<!-- <BarRooms /> -->
					</div>

					<!-- /Side Bar Content -->
				</div>
			{:else}
				<AuthForm />
			{/if}
		</div>
	</div>
</main>
