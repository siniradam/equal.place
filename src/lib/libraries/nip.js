// @ts-nocheck

export const nipDefine = (package) => {
	let { id, pubkey, created_at, kind, tags, content, sig } = package;
};

//matata@nostrplebs.com

export const nip5Verify = async (identifier, pubkey, callback) => {
	let id = identifier.split('@');

	return await fetch(`https:\/\/${id[1]}/.well-known/nostr.json?name=${id[0]}`, {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then((response) => response.json())
		.then((data) => {
			if (data?.names?.[id[0]]) {
				return data?.names?.[id[0]] == pubkey;
			} else {
				return false;
			}
		})
		.catch(console.error);
};
