// @ts-nocheck
import { relayPool, generatePrivateKey, getPublicKey, signEvent } from 'nostr-tools';

/**
 * @typedef NostrManagerInstance
 * @property {Function} init
 * @property {Object} set
 * @property {Object} pool
 * @property {String} publicKey
 * @property {String} privateKey
 */

let NostrManager = function () {
	let defaultServer = 'wss://nostr.rocks';
	//let defaultServer = 'wss://nostr-relay.untethr.me';
	let pool, publicKey, privateKey, parseEvent;

	let eventTypes = {
		0: { type: 'meta' },
		1: { type: 'note' },
		2: { type: 'server' },
		3: { type: 'contacts' },
		7: { type: 'reaction' }
	};

	//New Version
	const eventHandlerNEW = function ({ event, relay, type, id }) {
		console.log({ relay, event });
	};
	//Old Version
	const eventHandler = function (event, relay) {
		console.log({ relay, event });
	};

	return {
		init: function () {
			this.pool = relayPool();
			this.pool.addRelay(defaultServer);
			return this;
		},
		pool: null,
		publicKey: '',
		privateKey: '',
		eventHandler,
		setPublicKey: function (/** @type {any} */ key) {
			this.publicKey = key;
			localStorage.setItem('pub_key', key);
			return this;
		},
		setPrivateKey: function (/** @type {any} */ key) {
			this.privateKey = key;
			localStorage.setItem('private_key', key);
			return this;
		},
		setHandler: function (callback) {
			this.eventHandler = callback;
			// this.pool.on('event', this.eventHandler);
			return this;
		},
		subFeed: function () {
			if (this.publicKey && this.pool) {
				let filter = { author: this.publicKey, limit: 10, skipVerification: true };
				console.log(filter);
				this.feed = this.subscribe(filter);
			}
			return this;
		},
		subscribe: function (filter) {
			if (this.pool) {
				try {
					return this.pool.sub({ cb: eventHandler, filter });
				} catch (error) {
					console.error(error);
				}
			}
			return this;
		}
	};
};

export default NostrManager;

const init = () => {
	const pool = relayPool();

	let publicKey = 'd4cf9c207dc78d22bff7cf40cd6f611c1059c25a07844532210c6dff99690498';

	//pool.setPrivateKey('<hex>'); // optional

	/**
	 * @param {any} event
	 * @param {any} relay
	 */
	function onEvent(event, relay) {
		// console.log(`got an event from ${relay.url} which is already validated.`);
		console.log(event);
	}

	pool.addRelay('wss://nostr.rocks', { read: true, write: true });
	//pool.addRelay('ws://other.relay.cool', { read: true, write: true });

	pool.sub({ cb: onEvent, filter: { author: publicKey, skipVerification: true } });

	return pool;
};

// export { init, subscribe, getEvent };

const basicSample = () => {
	// connect to a relay
	var ws = new WebSocket('wss://nostr-pub.wellorder.net');
	// send a subscription request for text notes from authors with my pubkey
	ws.addEventListener('open', function (event) {
		ws.send('["REQ", "my-sub", {"kinds":[1], "authors":["35d26e4690cbe1"]}]');
	});
	// print out all the returned notes
	ws.addEventListener('message', function (event) {
		console.log('Note: ', JSON.parse(event.data)[2]['content']);
	});
};
