import { writable } from 'svelte/store';
import { relays } from './libraries/constants';

export const siteStore = writable({
	connecting: true,
	unreadNote: 0,
	relays: relays,
	connectedRelays: []
});

export const userStoreDefaultValues = {
	profile: {},
	keys: {},
	config: {
		autoDisconnect: false,
		showRelayStatus: true,
		fetch: {
			usersAlways: true,
			roomsAlways: true
		},
		onstart: {
			loadCount: 50,
			loadLimit: true
		},
		limits: {
			relayLimited: true,
			relayCount: 5001,

			noteLimited: true,
			noteCount: 50002,

			profileLimited: true,
			profileCount: 50003,

			chatMessageLimited: true,
			chatMessageCount: 50004,

			dmLimited: true,
			dmCount: 50005
		}
	}
};

export const userStore = writable(JSON.parse(JSON.stringify(userStoreDefaultValues)));

export const profilesStore = writable({});

export const contentStore = writable({});
export const channelStore = writable([]);
