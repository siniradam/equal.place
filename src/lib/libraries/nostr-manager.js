// @ts-nocheck

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

		profileReference: {
			method: null
		}
	};

	// Local Handlers
	let handleNote = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;

		let user = contacts.find((u) => {
			u.pubkey == event.pubkey;
		});

		// console.log(event);

		if (!user) {
			contacts.push({ pubkey, name: 'Unkown user' });
		}

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
		customHandlers.method.note(cleanNote);
	};

	let handleServer = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;
		console.log('Server:', event.content);
		customHandlers.method.server(event.content);
		addLog('handleServer', event);
		console.log({ relay });
		//recommend_server
	};

	let handleServerAddress = (relay) => {
		console.log('ServerFound:', [...new Set(relay)]);
		customHandlers.method.server([...new Set(relay)]);
	};

	let handleContacts = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;
		// console.log('Contacts:', JSON.parse(event.content));
		addLog('handleContacts', event);
	};

	// @ts-ignore
	let handleReaction = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;
		// console.log('Reaction:', event.content);
		addLog('handleReaction', event);
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
				customHandlers.method.profile(contact);
			}
			contacts.push(contact);
			customHandlers.method.meta(contact);

			// console.log('Meta', contact);
		} catch (error) {
			console.error(error);
			console.log('Meta', event);
		}
	};

	let handleChannelCreate = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;
		// console.log('ChannelCreate', event);
		addLog('handleChannelCreate', event);
	};

	let handleChannelMeta = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;
		// console.log('ChannelMeta', event);
		addLog('handleChannelMeta', event);
	};

	let handleChannelMessage = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;
		customHandlers.method.channelCreate(event);
		// console.log('ChannelMessage', event);
		addLog('handleChannelMessage', event);
	};

	let handleChannelHideMessage = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;
		// console.log('ChannelHideMessage', event);
		addLog('handleChannelHideMessage', event);
	};

	let handleChannelMuteUser = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;
		// console.log('ChannelMuteUser', event);
		addLog('handleChannelMuteUser', event);
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
					addLog('closingTask', requestIdentifier);
					ws.send(`["CLOSE", "${requestIdentifier}", ${JSON.stringify(filter)}]`);
				}
			} else {
				requests[requestIdentifier] = [requestGroup.filter((r) => r.pubkey != pubkey)];
			}
		}
	};

	return {
		init: function () {
			ws = new WebSocket('wss://nostr-pub.wellorder.net');

			ws.addEventListener('close', (event) => {
				console.log('Disconnected');
			});

			ws.addEventListener('message', (event, relay) => {
				let data = JSON.parse(event.data);

				if (data[2]) {
					let event = data[2];
					completeRequest(data[1], event.pubkey);

					if (event.kind == 1) {
						let user = contacts.find((u) => {
							u.pubkey == event.pubkey;
						});

						if (!user) {
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
		setNoteHandler: function (/** @type {fuction} */ method) {
			customHandlers.method.note = method;
			return this;
		},
		setMetaHandler: function (/** @type {fuction} */ method) {
			customHandlers.method.meta = method;
			return this;
		},
		setChannelCreate: function (/** @type {fuction} */ method) {
			customHandlers.method.channelCreate = method;
			return this;
		},
		setProfileUpdate: function (/** @type {fuction} */ method) {
			customHandlers.method.profile = method;
			return this;
		},
		setExternalProfileReference: function (/** @type {fuction} */ method) {
			customHandlers.method.profileReference = method;
			return this;
		},
		getFeed: function () {
			ws.addEventListener('open', (event) => {
				console.log('Connected');
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
			ws.send(`["REQ", "getProfile-${pubkey}", ${JSON.stringify(filter)}]`);
			trackRequest(`getProfile-${pubkey}`, pubkey);

			return this;
		},
		on: function (event, method) {
			if (customHandlers[event]) {
				customHandlers[event].method = method;
			} else {
				console.error('Unkown event', event);
				return this;
			}
		}
	};
};

export default NostrManager;
