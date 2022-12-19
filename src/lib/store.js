import { writable } from 'svelte/store';

export const siteStore = writable({
	connecting: true,
	relays: [
		'wss://nostr-pub.wellorder.net',
		'wss://nostr.rocks',
		'wss://nostr.bitcoiner.social',
		'wss://nostr-relay.untethr.me',
		'wss://nostr-pub.semisol.dev',
		'wss://nostr.drss.io',
		'wss://relay.damus.io',
		'wss://nostr.openchain.fr',
		'wss://nostr.delo.software',
		'wss://relay.nostr.info',
		'wss://nostr.oxtr.dev',
		'wss://nostr.ono.re',
		'wss://relay.grunch.dev',
		'wss://nostr.sandwich.farm',
		'wss://relay.nostr.ch'
	]
});

export const userStore = writable({
	profile: {},
	keys: {},
	loggedin: false
});

export const profilesStore = writable({});

export const contentStore = writable([]);
export const channelStore = writable([]);
