<script>
	import { generatePrivateKey, getPublicKey } from '$lib/libraries/keysTools';
	import { userStore } from '$lib/store';
	import { onMount } from 'svelte';
	import SectionTitle from './SectionTitle.svelte';
	import Slider from './Slider.svelte';

	let keysGenerated = false;
	let extensionChromeURL =
		'https://chrome.google.com/webstore/detail/nos2x/kpgefcfmnafjgpblomihpgmejjdanjjp';
	let extensionFirefoxURL = 'https://addons.mozilla.org/en-US/firefox/addon/nos2x/';

	//Input reference for login
	let justKey = ''; //d4cf9c207dc78d22bff7cf40cd6f611c1059c25a07844532210c6dff99690498
	let isPrivateKey = false; //Is key used for login private or public?

	//Input References for registering.
	let publicKey = '';
	let privateKey = '';

	onMount(() => {
		let keyStored = localStorage.getItem('public_key');
		if (keyStored) {
			setKeyInStore(keyStored);
		}
	});

	function setKeyInStore(key) {
		let uStore = { ...$userStore };
		uStore.keys.public = key;
		userStore.set(uStore);
	}

	function setKeyToLogin() {
		if (isPrivateKey) {
			// localStorage.setItem('private_key', justKey);
			alert('Login with private key is not enabled right now.');
		} else {
			localStorage.setItem('public_key', justKey);
			setKeyInStore(justKey);
		}
	}

	function createKeyPair() {
		keysGenerated = true;
		isPrivateKey = false;
		privateKey = generatePrivateKey();
		justKey = publicKey = getPublicKey(privateKey);
	}

	function goBack() {
		keysGenerated = false;
		justKey = '';
		publicKey = '';
		privateKey = '';
	}

	function saveAndLogin() {
		alert("I haven't finished this one yet.");
	}
</script>

<div class="mid">
	<!-- First Text Block -->
	<div class="card bg-panel notice">
		<SectionTitle>👋 Welcome</SectionTitle>
		<p>If you had an access to Nostr network before, you can use your keys.</p>
	</div>

	<!-- Auth Form -->
	<div class="card bg-panel">
		<div class="flex flex-col gap-3">
			<SectionTitle>🗝️ Login</SectionTitle>
			<input class="big text-center rounded-lg" placeholder="Key" bind:value={justKey} />
			<div class="flex gap-3">
				<Slider bind:checked={isPrivateKey} class="warn" />
				<button
					class="primary rounded-lg {isPrivateKey ? 'warn' : ''}"
					disabled={justKey.length < 50}
					on:click={setKeyToLogin}>Login With {isPrivateKey ? 'Private' : 'Public'} Key</button
				>
			</div>
		</div>
	</div>
	<!-- Second Text Block -->
	<div class="card bg-panel notice">
		<SectionTitle>🤷🏻‍♂️ Is this your first time?</SectionTitle>
		<p>We can generate keys for you.</p>
		<p>You'll have 2 keys. Public keys are for reading and sharing with others.</p>
		<p>
			Your private key is your identity, keep it secure, if you lose it there is no way to retrieve
			it.
		</p>
	</div>

	<!-- Generate New Keys Block -->
	<div class="card bg-panel">
		<div class="flex flex-col gap-3">
			<SectionTitle>🥳 New Profile</SectionTitle>
			<div class="line">
				<div class="hover-label">Public 📢</div>
				<input class="big rounded-lg" placeholder="Public key" bind:value={publicKey} />
			</div>
			<div class="line">
				<div class="hover-label">Private 🔐</div>
				<input class="big rounded-lg" placeholder="Private key" bind:value={privateKey} />
			</div>
			{#if keysGenerated}
				<div class="flex gap-3">
					<button class="primary rounded-lg quarter" on:click={goBack}>Go Back</button>
					<button class="secondary rounded-lg" on:click={saveAndLogin}
						>Save In Browser & Login</button
					>
				</div>
			{:else}
				<button class="primary rounded-lg" on:click={createKeyPair}>Generate</button>
			{/if}
		</div>
	</div>

	<!-- Third Text Block -->
	<div class="card bg-panel notice">
		<SectionTitle>🧐 Some things to remember</SectionTitle>
		<p>- If you lose your key you can always create a new key.</p>
		<p>
			- Browser extensions can help you to store your keys. <a href={extensionChromeURL}>Chrome</a>,
			<a href={extensionFirefoxURL}>Firefox</a>
		</p>
		<p>- Nostr Protocol is still in it's early stages. Weird things might happen.</p>
	</div>
</div>
