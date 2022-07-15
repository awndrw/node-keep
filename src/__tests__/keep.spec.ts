import { Keep } from '..';
import { vol } from 'memfs';

jest.mock('fs');

describe('Keep', () => {
	beforeEach(() => {
		vol.reset();
	});
});

const keep = new Keep();
