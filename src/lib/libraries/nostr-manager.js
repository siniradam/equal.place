// @ts-nocheck

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

//+ NSFWJS

let NostrManager = function () {
	// DB
	var db = new PouchDB('profiles');

	let defaultServer = 'wss://nostr.rocks';
	//let defaultServer = 'wss://nostr-relay.untethr.me';
	let pool, privateKey, parseEvent;
	let publicKey = 'd4cf9c207dc78d22bff7cf40cd6f611c1059c25a07844532210c6dff99690498';
	let filter = { author: publicKey, limit: 2, skipVerification: false };
	let profileFetched = false;

	let requests = {};

	let contacts = [];
	const customHandlers = {
		note: (event) => {},
		server: (event) => {},
		contacts: (event) => {},
		reaction: (event) => {},
		meta: (event) => {},
		channelCreate: (event) => {},
		profile: (event) => {}
	};

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
					console.log('Unsubscribing', requestIdentifier);
					ws.send(`["CLOSE", "${requestIdentifier}", ${JSON.stringify(filter)}]`);
				}
			} else {
				requests[requestIdentifier] = [requestGroup.filter((r) => r.pubkey != pubkey)];
			}
		}
	};

	let handleNote = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;

		let user = contacts.find((u) => {
			u.pubkey == event.pubkey;
		});

		if (!user) {
			contacts.push({ pubkey, name: 'Unkown user' });
		}

		let cleanNote = {
			user: { pubkey, name: 'Unkown user' },
			pubkey: event.pubkey,
			content: event.content,
			meta: {
				created_at,
				id,
				kind,
				sig,
				tags
			}
		};
		// console.log('NOTE:', cleanNote);
		customHandlers.note(cleanNote);
	};

	let handleServer = (event, relay) => {
		//recommend_server
		// console.log('Server:', event.content);
	};

	let handleContacts = (event, relay) => {
		// console.log('Contacts:', JSON.parse(event.content));
	};

	// @ts-ignore
	let handleReaction = (event, relay) => {
		// console.log('Reaction:', event.content);
	};

	// @ts-ignore
	let handleMeta = (event, relay) => {
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
				customHandlers.profile(contact);
			} else {
				contacts.push(contact);
				customHandlers.meta(contact);
			}

			// console.log('Meta', contact);
		} catch (error) {
			console.error(error);
			console.log('Meta', event);
		}
	};

	let handleChannelCreate = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;
		console.log('ChannelCreate', event);
	};

	let handleChannelMeta = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;
		// console.log('ChannelMeta', event);
	};

	let handleChannelMessage = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;
		customHandlers.channelCreate(event);
		// console.log('ChannelMessage', event);
	};

	let handleChannelHideMessage = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;
		// console.log('ChannelHideMessage', event);
	};

	let handleChannelMuteUser = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;
		// console.log('ChannelMuteUser', event);
	};
	let ws;

	return {
		init: function () {
			ws = new WebSocket('wss://nostr-pub.wellorder.net');

			ws.addEventListener('message', (event, relay) => {
				let data = JSON.parse(event.data);

				if (data[2]) {
					let event = data[2];
					completeRequest(data[1], event.pubkey);

					if (event.kind == 1) {
						let usr = contacts.find((u) => {
							u.pubkey == event.pubkey;
						});
						if (!usr) {
							this.getUserMeta(event.pubkey);
						}
					}

					switch (event.kind) {
						case 0:
							handleMeta(event, relay);
							break;
						case 1:
							handleNote(event, relay);
							break;
						case 2:
							handleServer(event, relay);
							break;
						case 3:
							handleContacts(event, relay);
							break;
						case 7:
							handleReaction(event, relay);
						case 40:
							handleChannelCreate(event, relay);
						case 41:
							handleChannelMeta(event, relay);
						case 42:
							handleChannelMessage(event, relay);
						case 43:
							handleChannelHideMessage(event, relay);
						case 44:
							handleChannelMuteUser(event, relay);
						default:
					}
				}
			});

			return this;
		},
		setNoteHandler: function (/** @type {any} */ method) {
			customHandlers.note = method;
			return this;
		},
		setMetaHandler: function (/** @type {any} */ method) {
			customHandlers.meta = method;
			return this;
		},
		setChannelCreate: function (/** @type {any} */ method) {
			customHandlers.channelCreate = method;
			return this;
		},
		setProfileUpdate: function (/** @type {any} */ method) {
			customHandlers.profile = method;
			return this;
		},
		getFeed: function () {
			ws.addEventListener('open', (event) => {
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

			let filter = { authors: [pubkey], limit: 1, kinds: [0] };
			ws.send(`["REQ", "getProfile", ${JSON.stringify(filter)}]`);
			trackRequest('getProfile', pubkey);

			return this;
		}
	};
};

// 		let publicKey = 'd4cf9c207dc78d22bff7cf40cd6f611c1059c25a07844532210c6dff99690498';
// let filter = {author: publicKey, limit: 2, skipVerification: true};

export default NostrManager;
