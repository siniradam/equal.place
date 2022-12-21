import { openDB, deleteDB, wrap, unwrap } from 'idb';

const dbVersion = 1;

export const db = async function () {
	// const dbPromise = openDB('equal', 1);

	let profilesStore, roomsStore;

	const eqdb = await openDB('equal.place', dbVersion, {
		upgrade(db) {
			//Profiles
			profilesStore = db.createObjectStore('profiles', {
				keyPath: 'pubkey'
			});
			profilesStore.createIndex('name', 'name');

			//Rooms
			roomsStore = db.createObjectStore('rooms', {
				keyPath: 'pubkey'
			});
			roomsStore.createIndex('name', 'name');
		}
	});

	const getProfile = async (pubkey) => get('profiles', pubkey);
	const addProfile = async (user) => upsert('profiles', user);

	const getRoom = async (pubkey) => get('rooms', pubkey);
	const addRoom = async (user) => upsert('rooms', user);

	//Queries
	const get = async (storeName, primaryKeyValue) => {
		return await eqdb.get(storeName, primaryKeyValue);
	};

	const upsert = async (storeName, record) => {
		let now = Math.floor(Date.now() / 1000);

		record.date_created = now;
		record.date_updated = now;

		return await eqdb
			.add(storeName, record)
			.then(() => {
				return record;
			})
			.catch(async () => {
				let currentRecord = await getProfile(record.pubkey);
				let newRecord = {
					...currentRecord, //Old Record
					...record, //New Record
					date_updated: now //New Date
				};
				await eqdb.put(storeName, newRecord);

				return newRecord;
			});
	};

	return {
		db: eqdb,
		getProfile,
		getRoom,
		addProfile,
		addRoom
	};
};

export const dbGet = async (store, pubkey) =>
	(await openDB('equal.place', dbVersion)).get(store, pubkey);
