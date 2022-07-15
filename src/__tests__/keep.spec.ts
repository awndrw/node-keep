import { vol } from 'memfs';
import fs from 'fs/promises';

jest.mock('fs/promises');

import { Keep } from '..';

describe('Keep', () => {
	const testDir = '/.keep/storage';
	let keep: Keep;

	beforeEach(() => {
		vol.reset();
		keep = new Keep({ dir: testDir });
	});

	describe('init', () => {
		it('should create the storage directory when an instance is created', async () => {
			await keep.init();
			const files = await fs.readdir(testDir);
			expect(files).toEqual([]);
		});

		it('should create an instance normally if the storage directory already exists', async () => {
			await fs.mkdir(testDir, { recursive: true });
			expect(keep.init()).resolves.not.toThrow();
		});
	});

	describe('data', () => {
		beforeEach(async () => {
			await keep.init();
		});

		it('should return an empty object if the storage directory is empty', async () => {
			const data = await keep.data();
			expect(data).toEqual({});
		});

		it('should return an object with the data from the storage directory', async () => {
			const data = {
				key1: 'value1',
				key2: 'value2',
			};
			Object.entries(data).forEach(async ([key, value]) => {
				await keep.setItem(key, value);
			});
			const dataFromKeep = await keep.data();
			expect(dataFromKeep).toEqual(data);
		});
	});
});
