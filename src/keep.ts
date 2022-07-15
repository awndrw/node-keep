import fs from 'fs';
import nodePath from 'path';
import type { Config, DatumKey, DatumValue, Datum } from './base';
import { createDefaultConfig, isDatum, hash } from './base';

const DEFAULT_CONFIG: Config = createDefaultConfig();

export class Keep {
	private readonly config: Config;
	private readonly storageDir: string;

	constructor(config: Partial<Config> = DEFAULT_CONFIG) {
		this.config = { ...DEFAULT_CONFIG, ...config };

		const { dir } = this.config;
		const resolvedDir = nodePath.isAbsolute(dir)
			? dir
			: nodePath.resolve(process.cwd(), dir);
		if (!fs.existsSync(resolvedDir)) {
			try {
				fs.mkdirSync(resolvedDir, { recursive: true });
			} catch (err) {
				throw new Error(`Could not create storage directory: ${err}`);
			}
		}
		this.storageDir = resolvedDir;
	}

	public async data(): Promise<Record<string, DatumValue>> {
		const data = (await this.readDir()) ?? [];
		return data.reduce((res, datum) => {
			res[datum.key.toString()] = datum.value;
			return res;
		}, {});
	}

	public async keys(): Promise<string[]> {
		const data = await this.data();
		return Object.keys(data);
	}

	public async values(): Promise<DatumValue[]> {
		const data = await this.data();
		return Object.values(data);
	}

	public setItem(key: DatumKey, value: DatumValue) {
		const filePath = this.getDatumPath(key);
		const datum: Datum = { key, value };
		return this.writeFile(filePath, datum);
	}

	public getItem(key: DatumKey) {
		const filePath = this.getDatumPath(key);
		return this.readFile(filePath);
	}

	public removeItem(key: DatumKey) {
		const filePath = this.getDatumPath(key);
		return this.removeFile(filePath);
	}

	public async clear() {
		const keys = (await this.keys()) ?? [];
		for (const key of keys) {
			this.removeItem(key);
		}
	}

	private writeFile(filePath: string, data: Datum): Promise<void> {
		return new Promise((resolve, reject) => {
			fs.writeFile(filePath, JSON.stringify(data), err => {
				if (err) {
					this.log(`Could not write file: ${err}`);
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	private readFile(filePath: string): Promise<Datum | undefined> {
		return new Promise((resolve, reject) => {
			fs.readFile(filePath, (err, data) => {
				if (err) {
					if (err.code === 'ENOENT') {
						this.log(`No data found for key: ${filePath}`);
						resolve(undefined);
					} else {
						this.log(`Could not read file: ${err}`);
						reject(err);
					}
				} else {
					const content = JSON.parse(data.toString());
					const datum = isDatum(content) ? content : undefined;
					resolve(datum);
				}
			});
		});
	}

	private removeFile(filePath: string): Promise<void> {
		return new Promise((resolve, reject) => {
			fs.unlink(filePath, err => {
				if (err) {
					this.log(`Could not remove file: ${err}`);
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	public readDir(): Promise<Datum[] | undefined> {
		return new Promise((resolve, reject) => {
			fs.readdir(this.storageDir, (err, files) => {
				if (err) {
					if (err.code === 'ENOENT') {
						this.log(`No directory found: ${this.storageDir}`);
						resolve(undefined);
					} else {
						this.log(`Could not read directory: ${err}`);
						reject(err);
					}
				} else {
					const datums: Datum[] = [];
					for (const file of files) {
						this.readFile(file).then(datum => {
							if (datum) {
								datums.push(datum);
							}
						});
					}
					resolve(datums);
				}
			});
		});
	}

	private getDatumPath(key: DatumKey): string {
		return nodePath.join(this.storageDir, hash(key));
	}

	private log(...args: any[]) {
		if (this.config.log) {
			this.config.log(...args);
		}
	}
}
