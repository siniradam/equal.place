// @ts-nocheck
//+ NSFWJS

/** @deprecated This is stupid, better version (kind of) is on nostr-manager2.js Will be removed, new one will be renamed. */

let NostrManager = function (publicKey) {
	// DB
	window.nostrlogs = [];
	let ws;

	const addLog = (category, log) => {
		if (log) {
			if (!nostrlogs[category]) {
				nostrlogs[category] = [];
			}

			nostrlogs[category].push(log);
		}
	};

	let filter = { author: publicKey, limit: 2, skipVerification: false };
	let profileFetched = false;

	let requests = {};
	let contacts = [];

	const handlers = {};

	// Local Handlers
	handlers.note = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;

		let capturedTags = parseTags(tags);
		let relays = [...capturedTags.foundRelays];
		delete capturedTags.foundRelays;

		let cleanNote = {
			user: { pubkey, name: 'Unkown user' },
			pubkey: event.pubkey,
			content: `${event.content}`.linkify(),
			meta: {
				created_at,
				id,
				kind,
				sig,
				tags
			},
			...capturedTags
		};

		if (relays.length) {
			handleServerAddress(relays);
		}
		customHandlers.note.method(cleanNote);
	};

	handlers.server = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;
		console.log('Server:', event.content);
		customHandlers.server.method(event.content);
		addLog('handleServer', event);
		console.log({ relay });
		//recommend_server
	};

	handlers.serverAddress = (relay) => {
		// console.log('ServerFound:', [...new Set(relay)]);
		customHandlers.server.method([...new Set(relay)]);
	};

	handlers.contacts = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;
		// console.log('Contacts:', JSON.parse(event.content));
		addLog('handleContacts', event);
	};

	// @ts-ignore
	handlers.reaction = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;
		// console.log('Reaction:', event.content);
		addLog('handleReaction', event);
	};

	// @ts-ignore
	handlers.meta = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;
		try {
			let contact = {
				pubkey,
				...JSON.parse(content),
				meta: {
					created_at,
					id,
					kind,
					sig,
					tags
				}
			};

			if (pubkey == publicKey) {
				profileFetched = true;
				customHandlers.profile.method(contact);
			}
			contacts.push(contact);
			customHandlers.meta.method(contact);

			// console.log('Meta', contact);
		} catch (error) {
			console.error(error);
			console.log('Meta', event);
		}
	};

	handlers.channelCreate = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;
		// console.log('ChannelCreate', event);
		addLog('handleChannelCreate', event);
	};

	handlers.channelMeta = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;
		// console.log('ChannelMeta', event);
		addLog('handleChannelMeta', event);
	};

	handlers.channelMessage = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;
		customHandlers.channelCreate.method(event);
		// console.log('ChannelMessage', event);
		addLog('handleChannelMessage', event);
	};

	handlers.channelHideMessage = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;
		// console.log('ChannelHideMessage', event);
		addLog('handleChannelHideMessage', event);
	};

	handlers.channelMuteUser = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;
		// console.log('ChannelMuteUser', event);
		addLog('handleChannelMuteUser', event);
	};

	handlers.dM = (event, relay) => {};

	handlers.dummy = (event, relay) => {};

	//Started Subscriptions Logged Here.
	const trackRequest = (requestIdentifier, pubkey) => {
		if (!requests[requestIdentifier]) {
			requests[requestIdentifier] = [];
		}
		requests[requestIdentifier].push({ pubkey });
	};

	const completeRequest = (requestIdentifier, pubkey) => {
		if (requests[requestIdentifier]) {
			let requestGroup = requests[requestIdentifier];

			if (requestGroup.length == 1) {
				delete requests[requestIdentifier];
				if (ws) {
					addLog('closingTask', requestIdentifier);
					ws.send(`["CLOSE", "${requestIdentifier}", ${JSON.stringify(filter)}]`);
				}
			} else {
				requests[requestIdentifier] = [requestGroup.filter((r) => r.pubkey != pubkey)];
			}
		}
	};

	const socketMessageHandler = (data, relay) => {
		const { type, subscriptionName, event } = data;
		if (type == 'EVENT' && typeof event == 'object') {
			//Unsubsscribe from completed request subscriptions.
			completeRequest(subscriptionName, event.pubkey);
			//dbug
			switch (event.kind) {
				//Information;
				case 0:
					handlers.meta(event, relay);
					break;

				//Use Types
				case 1:
					handlers.note(event, relay);
					break;
				case 2:
					handlers.server(event, relay);
					break;
				case 3:
					handlers.contacts(event, relay);
					break;
				case 3:
					handlers.dM(event, relay);
					break;
				case 7:
					handlers.reaction(event, relay);
					break;
				//Chatting;
				case 40:
					handlers.channelCreate(event, relay);
					break;
				case 41:
					handlers.channelMeta(event, relay);
					break;
				case 42:
					handlers.channelMessage(event, relay);
					break;
				case 43:
					handlers.channelHideMessage(event, relay);
					break;
				case 44:
					handlers.channelMuteUser(event, relay);
					break;
				default:
					if (event.kind && event.kind < 60) {
						console.log(event.kind, data);
					}
			}
		}
	};

	return {
		init: function () {
			let relayAddress = 'wss://nostr-pub.wellorder.net';
			ws = new WebSocket(relayAddress);

			ws.addEventListener('close', (event) => {
				console.log('Disconnected');
			});

			ws.addEventListener('message', (message) => {
				let relay = message.origin;
				let data = JSON.parse(message.data);
				const [type, subscriptionName, event] = data;

				//If this is a note, there is a user in it.
				if (event.kind == 1) {
					//Event's pubkey is the user's pubkey.
					let user = contacts.find((u) => {
						u.pubkey == event.pubkey;
					});

					if (!user) {
						contacts.push({ pubkey: event.pubkey, name: 'Unkown user' });
						this.getUserMeta(event.pubkey);
					}
				}

				socketMessageHandler({ type, subscriptionName, event }, relay);
			});

			return this;
		},

		getFeed: function () {
			ws.addEventListener('open', (event) => {
				console.log('Connected'); //Socket ref: , { event }
				ws.send(`["REQ", "feed", ${JSON.stringify(filter)}]`);
				this.getProfile();
			});
			return this;
		},
		getProfile: function () {
			this.getUserMeta(publicKey);
			return this;
		},
		getUserMeta: function (pubkey) {
			//# Filters
			let filter = { authors: [pubkey], limit: 1, kinds: [0] };
			ws.send(`["REQ", "getProfile-${pubkey}", ${JSON.stringify(filter)}]`);
			trackRequest(`getProfile-${pubkey}`, pubkey);

			return this;
		},
		/**
		 *
		 * @param {Object} event
		 * @param {Function} method
		 * @returns
		 */
		on: function (event, method) {
			if (customHandlers[event]) {
				customHandlers[event].method = method;
			} else {
				console.error('Unkown event', event);
			}
			return this;
		}
	};
};

// External Handlers
const customHandlers = {
	note: {
		method: (event) => {}
	},

	server: {
		method: (event) => {}
	},

	contacts: {
		method: (event) => {}
	},

	reaction: {
		method: (event) => {}
	},

	meta: {
		method: (event) => {}
	},

	channelCreate: {
		method: (event) => {}
	},

	profile: {
		method: (event) => {}
	},

	profileReference: {
		method: null
	}
};

//Utils

function keyToSomething(key) {
	const sumOfNumbers = key
		.replace(/[^0-9]/g, '')
		.split('')
		.reduce((a, b) => parseInt(a) + parseInt(b));
}

function parseTags(tags) {
	let tagList = [];
	let foundRelays = [];

	let client = 'unkown',
		rootThread = '',
		replyTo = '',
		events = [];

	try {
		if (Array.isArray(tags)) {
			tagList = tags.map((tagItem) => {
				const [tag, value, relay, type] = tagItem;

				if (type) {
					if (type == 'root') {
						rootThread = value;
					}

					if (type == 'reply') {
						replyTo = value;
					}
				}

				if (tag == 'client') {
					client = value;
				}

				if (tag == 'e') {
					events.push({ pubkey: value, type: type || '' });
				}

				if (relay) {
					foundRelays.push(relay);
				}

				return { tag, value, relay, type };
			});
		}
	} catch (error) {
		console.error(error);
	}

	return {
		rootThread,
		replyTo,
		client,
		events,
		foundRelays
	};
}

if (!String.linkify) {
	String.prototype.linkify = function () {
		// http://, https://, ftp://
		var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

		// www. sans http:// or https://
		var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

		// Email addresses
		var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

		return this.replace(urlPattern, '<a href="$&">$&</a><br>')
			.replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a><br>')
			.replace(emailAddressPattern, '<a href="mailto:$&">$&</a><br>');
	};
}

//# Filters
// {
//   "ids": <a list of event ids or prefixes>,
//   "authors": <a list of pubkeys or prefixes, the pubkey of an event must be one of these>,
//   "kinds": <a list of a kind numbers>,
//   "#e": <a list of event ids that are referenced in an "e" tag>,
//   "#p": <a list of pubkeys that are referenced in a "p" tag>,
//   "since": <a timestamp, events must be newer than this to pass>,
//   "until": <a timestamp, events must be older than this to pass>,
//   "limit": <maximum number of events to be returned in the initial query>
// }

//# KIND references
// 0	Metadata
// 1	Text
// 2	Recommend Relay
// 3	Contact
// 4	Encrypted Direct Messages
// 5	Event Deletion
// 7	Reaction
// 40	Channel Creation
// 41	Channel Metadata
// 42	Channel Message
// 43	Channel Hide Message
// 44	Channel Mute User
// 45-49	Public Chat Reserved

//# Utils

const contentFilter = (data) => {
	let filter = [
		'bdsmlr.com/',
		'coedcherry.com/',
		'.tnaflix.com/',
		'eporner.com/',
		'i.imgur.com/',
		'xhcdn.com/'
	];
	return !filter.find((word) => {
		return data.content.includes(word);
	});
};

const checkForImage = (url) => {
	let regex = /^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)\??.*$/gim;
	let result;
	if (url.match(regex)) {
		result = {
			match: url.match(regex)
		};
	} else {
		result = false;
	}
	return result;
};

export default NostrManager;

// setNoteHandler: function (/** @type {fuction} */ method) {
// 	customHandlers.note.method = method;
// 	return this;
// },
// setMetaHandler: function (/** @type {fuction} */ method) {
// 	customHandlers.meta.method = method;
// 	return this;
// },
// setChannelCreate: function (/** @type {fuction} */ method) {
// 	customHandlers.channelCreate.method = method;
// 	return this;
// },
// setProfileUpdate: function (/** @type {fuction} */ method) {
// 	customHandlers.profile.method = method;
// 	return this;
// },
// setExternalProfileReference: function (/** @type {fuction} */ method) {
// 	customHandlers.profileReference.method = method;
// 	return this;
// },
