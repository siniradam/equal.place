<script>
	// @ts-nocheck

	//Store
	import { userStore, siteStore, contentStore, profilesStore, channelStore } from '$lib/store';

	//Visual
	import '../app.css';
	import { onMount } from 'svelte';
	import CardRoom from '$lib/components/Cards/CardRoom.svelte';
	// import CardUser from '$lib/components/CardUser.svelte';
	import AuthForm from '$lib/components/Blocks/AuthForm.svelte';

	//NoSTR
	import NostrManager from '$lib/libraries/nostr-manager';
	import { db } from '$lib/db';
	import BarLastUser from '$lib/components/Parts/BarLastUser.svelte';
	import BarRooms from '../lib/components/Parts/BarRooms.svelte';
	import BarServers from '$lib/components/Parts/BarServers.svelte';
	import Nav from '$lib/components/Parts/Nav.svelte';
	import Footer from '$lib/components/Parts/Footer.svelte';

	let database; //db Reference
	let pubkey; //loggedin user key reference
	let isInitiated = false; //Is started. (this is here to prevent a bug. I shouldn't need this.)

	function setPublicKeyInStore(justKey) {
		let uStore = { ...$userStore };
		uStore.keys.public = justKey;
		userStore.set(uStore);
		console.log('Logging out.');
	}

	const addNoteToStore = (note) => {
		let newContent = [note, ...$contentStore];
		if (newContent.length > 150) {
			newContent.pop();
		}
		contentStore.set(newContent);
	};

	const noteHandler = (note) => {
		if ($contentStore.length < 10) {
			addNoteToStore(note);
		} else {
			siteStore.set({ $siteStore, unreadNote: $siteStore.unreadNote + 1 });
		}
	};

	const onChannelCreateReceived = (event) => {
		let newContent = { ...$channelStore };
		newContent[event.pubkey] = event;
		channelStore.set(newContent);
	};

	const onMetaReceived = (meta) => {
		let newContent = {};
		newContent[meta.pubkey] = meta;
		newContent = { ...newContent, ...$profilesStore };
		profilesStore.set(newContent);
		// console.log(meta);
		database.addProfile(meta);
	};

	const onProfileInformationReceived = (meta) => {
		userStore.set({ ...$userStore, profile: meta });
	};

	function init(key) {
		NostrManager(key)
			.setNoteHandler(noteHandler)
			.setMetaHandler(onMetaReceived)
			.setChannelCreate(onChannelCreateReceived)
			.setProfileUpdate(onProfileInformationReceived)
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
						<BarLastUser />
						<BarRooms />
					</div>

					<!-- /Side Bar Content -->
				</div>
			{:else}
				<AuthForm />
			{/if}
		</div>
	</div>
</main>
