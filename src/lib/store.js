import { writable } from 'svelte/store';
import { relays } from './libraries/constants';

export const siteStore = writable({
	connecting: true,
	unreadNote: 0,
	relays: relays
});

export const userStoreDefaultValues = {
	profile: {},
	keys: {}
};

export const userStore = writable(JSON.parse(JSON.stringify(userStoreDefaultValues)));

export const profilesStore = writable({});

export const contentStore = writable([]);
export const channelStore = writable([]);
