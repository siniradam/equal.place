import { relays } from './constants';
import { nostrSocketManager } from './nostr-socket';
import { isEmpty, parseJSON } from './utils';
import { makeFilter, parseContacts, parseTags } from './utils-nostr';

/**@typedef {"metaData" | "note" | "recommendRelay" | "contact" | "encryptedDirectMessage" | "eventDeletion" | "reaction" | "channelCreation" | "channelMetaData" | "channelMessage" | "channelHideMessage" | "channelMuteUser"}  NostrEventName*/

//TODO: ADD client info when submitting data.

const NostrManager = function (publicKey) {
	let nostrEvents = {
		0: 'metaData',
		1: 'note',
		2: 'recommendRelay',
		3: 'contact',
		4: 'encryptedDirectMessage',
		5: 'eventDeletion',
		7: 'reaction',
		40: 'channelCreation',
		41: 'channelMetaData',
		42: 'channelMessage',
		43: 'channelHideMessage',
		44: 'channelMuteUser'
	};

	//Active Subscriptions
	let requests = [];
	let contacts = [];

	const trackRequest = (requestIdentifier, pubkey) => {
		if (!requests[requestIdentifier]) {
			requests[requestIdentifier] = [];
		}
		requests[requestIdentifier].push({ pubkey });
	};

	//Handle Incoming stuff here.
	//After handling, send parsed version to, custom handlers.
	const localHandlers = {
		note: {
			//1
			method: ({ type, subscriptionName, event }, relayAddress) => {
				const { content, created_at, id, kind, pubkey, sig, tags } = event;

				let note = {
					id,
					user: { pubkey, name: 'Unkown user' },
					content,
					created_at,
					...parseTags(tags),
					meta: {
						kind,
						sig
					},
					seenOn: [relayAddress]
				};

				//Verify messages ignored.
				if (content.substr(0, 4) !== '#[0]') {
					customHandlers['note'].method(note);
				}
			}
		},

		recommendRelay: {
			//2
			method: ({ type, subscriptionName, event }, relayAddress) => {
				customHandlers['recommendRelay'].method(event);
			}
		},

		contact: {
			//3
			method: ({ type, subscriptionName, event }, relayAddress) => {
				// console.log({ contacts: event });

				let contacts = parseContacts(event.tags);
				customHandlers['contact'].method(contacts);
				// getFeed(contacts.map((contact) => contact.pubkey));
			}
		},

		reaction: {
			//7
			method: ({ type, subscriptionName, event }, relayAddress) => {
				customHandlers['reaction'].method(event);
			}
		},

		metaData: {
			//0
			method: ({ type, subscriptionName, event }, relayAddress) => {
				const { content, created_at, id, kind, pubkey, sig, tags } = event;
				let profile = parseJSON(content);

				let data = {
					id,
					profile: { pubkey, ...profile },
					...parseTags(tags),
					meta: {
						kind,
						sig
					}
				};

				if (event.pubkey == publicKey) {
					customHandlers['profile'].method(data);
				} else {
					customHandlers['metaData'].method(data);
				}
			}
		},

		channelCreate: {
			//40
			method: ({ type, subscriptionName, event }, relayAddress) => {
				customHandlers['channelCreate'].method(event);
			}
		},

		channelMetaData: {
			//41
			method: ({ type, subscriptionName, event }, relayAddress) => {
				customHandlers['channelMetaData'].method(event);
			}
		},

		channelMessage: {
			//42
			method: ({ type, subscriptionName, event }, relayAddress) => {
				customHandlers['channelMessage'].method(event);
			}
		},

		channelHideMessage: {
			//43
			method: ({ type, subscriptionName, event }, relayAddress) => {
				customHandlers['channelHideMessage'].method(event);
			}
		},

		channelMuteUser: {
			//44
			method: ({ type, subscriptionName, event }, relayAddress) => {
				customHandlers['channelMuteUser'].method(event);
			}
		}
	};

	const createRequest = (name, filter) => {
		return `["REQ", "${name}", ${JSON.stringify(filter)}]`;
	};

	//Socket
	let sm = nostrSocketManager();

	//Any incoming message here.
	const onMessage = (relayName, relayAddress, message) => {
		//Type Definition here.
		let { type, subscriptionName, event } = message;
		console.log(subscriptionName);

		//
		if (type == 'EVENT' && typeof event == 'object') {
			//
			if (!isEmpty(event.kind)) {
				if (nostrEvents[event.kind]) {
					/** @type {NostrEventName} */
					let nostrEventName = nostrEvents[event.kind];

					localHandlers[nostrEventName].method(message, relayAddress);
				} else {
					console.log('Unhandled kind', message);
				}
				//
			} else {
				console.log('Kind data is missing', { relayName, relayAddress, message });
			}
			//
		} else if (type == 'EOSE') {
		} else {
			console.log('NOT EVENT', { relayName, relayAddress, message });
		}
	};

	//On Connect Start submitting requests.
	const onConnect = (name, address, status) => {
		// console.log('MNGR', name, address, status);
		customHandlers.connect.method(name, address, status);
		getFeed();
		getProfile();
		// getContacts();//I've tried  to get contacts then feed, but it it didn't worked. I'm doing something wrong.
	};

	//Sends a request.
	const sendRequest = (reqName, filter, trackConfig) => {
		let request = createRequest(reqName, filter);

		//Should this request tracked?
		//To be used to unsubscribe when it's completed.
		if (trackConfig) {
			let { destroy, callback } = trackConfig; //!This isn't completed.
			//Assign response listener to Subscription?
			trackRequest(reqName);
		}
		sm.request(request);
	};

	const getProfile = () => {
		let filter = makeFilter().authors([publicKey]).limit(1).kinds([0]).build();

		sendRequest('profile', filter, true);
	};

	const getFeed = (followingList) => {
		let authors = [publicKey];

		if (Array.isArray(followingList)) {
			authors.push(...followingList);
		}

		let filter = makeFilter()
			.authors(authors)
			.until(Math.floor(Date.now() / 1000))
			.build();

		sendRequest('feed', filter);
	};

	const getContacts = () => {
		let filter = makeFilter().kinds([3]).authors([publicKey]).build();
		sendRequest('contacts', filter, true);
	};

	return {
		init: function () {
			sm.add(relays[0]);
			sm.add(relays[1]);
			sm.add(relays[2]);
			sm.on('message', onMessage);
			sm.on('connect', onConnect);
			sm.connect();
			return this;
		},
		on: function (event, handlerFunction) {
			if (customHandlers[event]) {
				customHandlers[event].method = handlerFunction;
			} else {
				console.log('Unkown handler', event);
			}

			return this;
		},
		feed: function () {
			getFeed();
			return this;
		},
		listEvents: function () {
			return Object.keys(customHandlers);
		}
	};
};

// External Handlers (CustomEvents)
const customHandlers = {
	note: {
		//1
		method: (event) => {}
	},

	recommendRelay: {
		//2
		method: (event) => {}
	},

	contact: {
		//3
		method: (event) => {}
	},

	reaction: {
		//7
		method: (event) => {}
	},

	profile: {
		//0 (loggedin.pubkey==event.pubkey)
		method: (event) => {}
	},

	metaData: {
		//0
		method: (event) => {}
	},

	channelCreate: {
		//40
		method: (event) => {}
	},

	channelMetaData: {
		//41
		method: (event) => {}
	},

	channelMessage: {
		//42
		method: (event) => {}
	},

	channelHideMessage: {
		//43
		method: (event) => {}
	},

	channelMuteUser: {
		//44
		method: (event) => {}
	},
	connect: {
		method: (name, address, status) => {}
	}
};

export default NostrManager;
