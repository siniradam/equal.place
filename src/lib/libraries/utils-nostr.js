export function parseTags(tags) {
	let tagList = [];
	// let foundRelays = [];

	let client = 'unkown',
		rootThread,
		replyTo,
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

				// if (relay) {
				// 	foundRelays.push(relay);
				// }

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
		events
		// foundRelays
	};
}

export const makeFilter = () => {
	let filter = {
		limit: 10
	};

	return {
		ids: function (ids) {
			filter.ids = ids;
			return this;
		},
		authors: function (pubkeys) {
			filter.authors = pubkeys;
			return this;
		},
		kinds: function (ids) {
			filter.kinds = ids;
			return this;
		},
		kind: function (singleId) {
			filter.kind = singleId;
			return this;
		},
		since: function (timestamp) {
			filter.since = timestamp;
			return this;
		},
		until: function (timestamp) {
			filter.until = timestamp;
			return this;
		},
		events: function (eventIds) {
			filter['#e'] = eventIds;
			return this;
		},
		pubkeys: function (pubKeys) {
			filter['#p'] = pubKeys;
			return this;
		},
		limit: function (count) {
			filter.limit = count;
			return this;
		},
		//
		build: function () {
			return filter;
		}
	};
};

export function parseContacts(tags) {
	return tags.map((item) => {
		let [tag, pubkey, relay, name] = item;
		if (tag == 'p') {
			return { tag, pubkey, relay, name };
		}
	});
}
