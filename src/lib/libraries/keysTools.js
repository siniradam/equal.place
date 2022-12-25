import * as secp256k1 from '@noble/secp256k1';
import { Buffer } from 'buffer';

import { bech32, bech32m } from 'bech32';

export function generatePrivateKey() {
	return Buffer.from(secp256k1.utils.randomPrivateKey()).toString('hex');
}

export function getPublicKey(privateKey) {
	return Buffer.from(secp256k1.schnorr.getPublicKey(privateKey)).toString('hex');
}

export function bech(key) {
	return bech32.decode(key);
}
