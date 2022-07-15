import crypto from 'crypto';

// INTERNAL DECLARATIONS
export type DatumKey = crypto.BinaryLike;
export type DatumValue = any;

export const createDefaultConfig = (subdir = 'storage'): Config => ({
	dir: `.keep/${subdir}`,
	log: console.log,
});

export const isDatum = (value: any): value is Datum =>
	value && value.key && value.value;

export const hash = (key: DatumKey) =>
	crypto.createHash('sha256').update(key).digest('hex');

// PUBLIC DECLARATIONS
export interface Config {
	/**
	 * The directory to store the data in.
	 * @default ".keep/storage"
	 */
	dir: string;

	/**
	 * A function to log errors to (or false to disable).
	 * @default console.log
	 */
	log: ((...args: any[]) => void) | false;
}

export interface Datum {
	key: DatumKey;
	value: DatumValue;
}
