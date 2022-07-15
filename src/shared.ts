import crypto from 'crypto';

/**
 * The key of a datum stored in Keep (not hashed).
 * @internal
 */
export type DatumKey = string;

/**
 * The value type of a datum stored in Keep.
 * @internal
 */
export type DatumValue = any;

/**
 * The data type stored in Keep.
 * @internal
 */
export interface Datum {
	key: DatumKey;
	value: DatumValue;
}

export const createDefaultConfig = (subdir = 'storage'): Config => ({
	dir: `.keep/${subdir}`,
	log: console.log,
});

/**
 * Returns true if the given value is a valid {@link Datum | datum}.
 * @internal
 */
export const isDatum = (datum: any): datum is Datum =>
	datum && datum.key && datum.value;

/**
 * @internal
 */
export function isError<T extends new (...args: any) => Error>(
	value: Error,
	errorType: T
): value is InstanceType<T> & NodeJS.ErrnoException {
	return value instanceof errorType;
}
/**
 * Returns the hash of the given key used to store the datum in Keep.
 * @internal
 */
export const hash = (key: DatumKey) =>
	crypto.createHash('sha256').update(key).digest('hex');

/**
 * The configuration for Keep storage.
 *
 * @privateRemarks
 * See {@link createDefaultConfig} for the default configuration.
 *
 * @public
 */
export interface Config {
	/**
	 * The directory to store the data in.
	 * @defaultValue ".keep/storage"
	 */
	dir: string;

	/**
	 * A function to log errors to (or false to disable).
	 * @defaultValue console.log
	 */
	log: ((...args: any[]) => void) | false;
}
