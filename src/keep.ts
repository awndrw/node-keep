import fs from 'fs/promises';
import nodePath from 'path';
import type { Config, DatumKey, DatumValue, Datum } from './shared';
import { createDefaultConfig, isDatum, hash, isError } from './shared';

const DEFAULT_CONFIG: Config = createDefaultConfig();

export class Keep {
	private readonly config: Config;
	private readonly storageDir: string;

	constructor(config: Partial<Config> = DEFAULT_CONFIG) {
		this.config = { ...DEFAULT_CONFIG, ...config };

		const { dir } = this.config;
		this.storageDir = nodePath.isAbsolute(dir)
			? dir
			: nodePath.resolve(process.cwd(), dir);
	}

	/**
	 * Initializes the storage directory.
	 * @public
	 */
	public async init() {
		try {
			await fs.mkdir(this.storageDir, { recursive: true });
		} catch (err) {
			throw new Error(`Could not create storage directory: ${err}`);
		}
	}

	/**
	 * Returns the data stored in the storage directory.
	 * @public
	 */
	public async data(): Promise<Record<string, DatumValue>> {
		const data = (await this.readDir()) ?? [];
		return data.reduce((res, datum) => {
			res[datum.key.toString()] = datum.value;
			return res;
		}, {} as Record<string, DatumValue>);
	}

	/**
	 * Returns the number of key-value pairs in the storage directory.
	 * @public
	 */
	public async length(): Promise<number> {
		const keys = await this.keys();
		return keys.length;
	}

	/**
	 * Returns the keys of the data stored in the storage directory.
	 * @public
	 */
	public async keys(): Promise<string[]> {
		const data = await this.data();
		return Object.keys(data);
	}

	/**
	 * Returns the values of the data stored in the storage directory.
	 * @public
	 */
	public async values(): Promise<DatumValue[]> {
		const data = await this.data();
		return Object.values(data);
	}

	/**
	 * Stores (or updates) a key-value pair in the storage directory.
	 * @returns An empty promise
	 * @public
	 */
	public setItem(key: DatumKey, value: DatumValue) {
		const filePath = this.getDatumPath(key);
		const datum: Datum = { key, value };
		return this.writeFile(filePath, datum);
	}

	/**
	 * Retrieves the value of the specified key or undefined if the key is not found.
	 * @returns The value of the datum or undefined
	 * @public
	 */
	public getItem(key: DatumKey) {
		const filePath = this.getDatumPath(key);
		return this.readFile(filePath);
	}

	/**
	 * Removes a key-value pair from the storage directory.
	 * @returns An empty promise
	 * @public
	 */
	public removeItem(key: DatumKey) {
		const filePath = this.getDatumPath(key);
		return this.removeFile(filePath);
	}

	/**
	 * Removes all key-value pairs from the storage directory.
	 * @public
	 */
	public async clear() {
		const keys = (await this.keys()) ?? [];
		for (const key of keys) {
			this.removeItem(key);
		}
	}

	private async writeFile(filePath: string, data: Datum): Promise<void> {
		try {
			await fs.writeFile(filePath, JSON.stringify(data));
		} catch (err) {
			this.throw(err);
		}
	}

	private async readFile(filePath: string): Promise<Datum | undefined> {
		try {
			const content = await fs.readFile(filePath);
			const parsedContent = JSON.parse(content.toString());
			const datum = isDatum(parsedContent) ? parsedContent : undefined;
			return datum;
		} catch (err) {
			if (this.catch(err, 'ENOENT')) {
				this.log(`No data found for key: ${filePath}`);
				return undefined;
			}
			this.throw(err);
		}
	}

	private async removeFile(filePath: string): Promise<void> {
		try {
			await fs.unlink(filePath);
		} catch (err) {
			this.throw(err);
		}
	}

	public async readDir(): Promise<Datum[]> {
		try {
			const files = await fs.readdir(this.storageDir);
			const data: Datum[] = [];
			for (const file of files) {
				const datum = await this.readFile(
					nodePath.join(this.storageDir, file)
				);
				if (datum) {
					data.push(datum);
				}
			}
			return data;
		} catch (err) {
			if (!this.catch(err, 'ENOENT')) {
				this.log(`No data found for directory: ${this.storageDir}`);
				await fs.mkdir(this.storageDir, { recursive: true });
				return [];
			}
			this.throw(err);
		}
		return [];
	}

	private getDatumPath(key: DatumKey): string {
		return nodePath.join(this.storageDir, hash(key));
	}

	/**
	 * Logs the provided data if logging is enabled.
	 */
	private log(...args: any[]) {
		if (this.config.log) {
			this.config.log(...args);
		}
	}

	/**
	 * Logs and throws the error if the config allows it.
	 * @param err - Any error object
	 * @internal
	 */
	private throw(err: any) {
		const error = err instanceof Error ? err : new Error(err);
		if (this.config.log) {
			this.config.log(error);
		}
		throw error;
	}

	/**
	 * Returns true if the error has the given code.
	 * @param err - Any error object
	 * @param code - A code to match against the error
	 * @returns true if the error matches the code
	 * @internal
	 */
	private catch(err: any, code: string) {
		if (!isError(err, Error)) {
			return false;
		}
		return err.code === code;
	}
}
