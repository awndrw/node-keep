import { vol } from 'memfs';
import fs from 'fs/promises';

jest.mock('fs/promises');

import { Keep } from '..';

describe('Keep', () => {
	const testDir = '.keep/storage';
	let keep: Keep;

	const testData = {
		key1: 'value1',
		key2: 'value2',
	};

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

	describe('methods', () => {
		beforeEach(async () => {
			await keep.init();
		});

		describe('data', () => {
			it('should return an empty object if the storage directory is empty', async () => {
				const data = await keep.data();
				expect(data).toEqual({});
			});

			it('should return an object with the data from the storage directory', async () => {
				Object.entries(testData).forEach(async ([key, value]) => {
					await keep.setItem(key, value);
				});
				const dataFromKeep = await keep.data();
				expect(dataFromKeep).toEqual(testData);
			});
		});

		describe('keys', () => {
			it('should return an empty array if the storage directory is empty', async () => {
				const data = await keep.keys();
				expect(data).toEqual([]);
			});

			it('should return an array with the keys from the storage directory', async () => {
				Object.entries(testData).forEach(async ([key, value]) => {
					await keep.setItem(key, value);
				});
				const dataFromKeep = await keep.keys();
				expect(dataFromKeep).toEqual(Object.keys(testData));
			});
		});

		describe('values', () => {
			it('should return an empty array if the storage directory is empty', async () => {
				const data = await keep.keys();
				expect(data).toEqual([]);
			});

			it('should return an array with the keys from the storage directory', async () => {
				Object.entries(testData).forEach(async ([key, value]) => {
					await keep.setItem(key, value);
				});
				const dataFromKeep = await keep.keys();
				expect(dataFromKeep).toEqual(Object.keys(testData));
			});
		});

		// TODO: set item

		// TODO: get item

		// TODO: remove item

		// TODO: clear
	});
});
