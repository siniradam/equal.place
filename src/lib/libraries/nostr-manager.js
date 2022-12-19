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

//+ NSFWJS

let NostrManager = function () {
	// DB
	var db = new PouchDB('profiles');

	let defaultServer = 'wss://nostr.rocks';
	//let defaultServer = 'wss://nostr-relay.untethr.me';
	let pool, privateKey, parseEvent;
	let publicKey = 'd4cf9c207dc78d22bff7cf40cd6f611c1059c25a07844532210c6dff99690498';
	let filter = { author: publicKey, limit: 2, skipVerification: false };

	let contacts = [];
	const customHandlers = {
		note: (event) => {},
		server: (event) => {},
		contacts: (event) => {},
		reaction: (event) => {},
		meta: (event) => {},
		channelCreate: (event) => {}
	};

	// @ts-ignore
	let handleNote = (event, relay) => {
		const { content, created_at, id, kind, pubkey, sig, tags } = event;

		let cleanNote = {
			user: contacts.find((u) => {
				u.pubkey == event.pubkey;
			}),
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

	// @ts-ignore
	let handleServer = (event, relay) => {
		//recommend_server
		// console.log('Server:', event.content);
	};

	// @ts-ignore
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
			contacts.push(contact);
			customHandlers.meta(contact);

			// db.put({ _id: pubkey, ...contact }, function callback(err, result) {
			// 	if (!err) {
			// 		console.log('Successfully posted a todo!');
			// 	} else {
			// 		console.log(err);
			// 	}
			// });

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

	return {
		init: function () {
			var ws = new WebSocket('wss://nostr-pub.wellorder.net');

			ws.addEventListener('open', function (event) {
				ws.send(`["REQ", "my-sub", ${JSON.stringify(filter)}]`);
			});

			ws.addEventListener('message', function (event, relay) {
				let data = JSON.parse(event.data);
				if (data[2]) {
					let event = data[2];

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
		}
	};
};

// 		let publicKey = 'd4cf9c207dc78d22bff7cf40cd6f611c1059c25a07844532210c6dff99690498';
// let filter = {author: publicKey, limit: 2, skipVerification: true};

export default NostrManager;
