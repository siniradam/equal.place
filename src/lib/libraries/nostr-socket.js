import { debug } from 'svelte/internal';

export const nostrSocketManager = function () {
	const servers = [];
	const debugMode = false;

	//onMessage Handler
	//disconnect Handler Method here. (reconnect handling?)

	const handlers = {
		connect: (name, address, status) => {},
		disconnect: (name, address, status) => {},
		message: (name, address, message) => {}
	};

	const log = (...args) => {
		if (debugMode) {
			console.log(...args);
		}
	};

	const info = (...args) => {
		if (debugMode) {
			console.info(...args);
		}
	};

	const warn = (...args) => {
		if (debugMode) {
			console.warn(...args);
		}
	};

	return {
		servers,

		add: function (address, name, accessMode) {
			if (!name) {
				name = address.replace('wss://', '');
			}

			if (!accessMode) {
				accessMode = 'readwrite';
			}

			info(address, 'added');

			//Append Server
			servers.push({ address, name, accessMode, ws: null, connected: false });
			return this;
		},
		//method
		on: function (eventName, callbackFunction) {
			//Assign Handlers
			if (handlers[eventName]) {
				handlers[eventName] = callbackFunction;
			} else {
				warn('Unrecognized event');
			}
			return this;
		},
		//method
		connect: function () {
			//Initiate connections.
			servers.forEach((server) => {
				if (!server.connected) {
					//Start
					server.ws = new WebSocket(server.address);
					//Events
					server.ws.addEventListener('open', (event) => {
						server.connected = true;
						handlers.connect(server.name, server.address, 'connected');
						info(`${server.name} connected`);
					});

					server.ws.addEventListener('close', (event) => {
						server.connected = false;
						handlers.connect(server.name, server.address, 'connected');
						info(`${server.name} disconnected`);
					});

					server.ws.addEventListener('message', (message) => {
						//Parse
						let relay = message.origin;
						let data = JSON.parse(message.data);
						//
						const [type, subscriptionName, event] = data;
						handlers.message(server.name, relay, { type, subscriptionName, event });
					});
				}
			});

			return this;
		},
		//method
		request: function (message) {
			let totalPublishedRelay = 0;
			servers.forEach((server) => {
				//Send to connected servers.
				if (server.connected) {
					server.ws.send(message);
					totalPublishedRelay++;
				}
			});
			info(`Published to ${totalPublishedRelay} relays`);
		},
		write: function (message) {
			let totalPublishedRelay = 0;
			servers.forEach((server) => {
				//Send to connected & writable servers.
				if (server.connected && server.accessMode.includes('write')) {
					server.ws.send(message);
					totalPublishedRelay++;
				}
			});
			info(`Published to ${totalPublishedRelay} relays`);
		},
		//
		crd: function (params) {
			//Connect & Request & Destroy.
			//Connects to a relay, sends a request, gets a response then disconnects.
			//IDEA.
		}
	};
};
