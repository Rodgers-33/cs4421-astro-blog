import { describe, expect, it } from 'vitest';
import { formatDate } from './date';

describe('formatDate', () => {
	it('formats a date with a short month and numeric day and year', () => {
		expect(formatDate(new Date('2022-07-08T00:00:00Z'))).toBe('Jul 8, 2022');
	});

	it('formats dates consistently when the day is a single digit', () => {
		expect(formatDate(new Date('2024-06-01T00:00:00Z'))).toBe('Jun 1, 2024');
	});
});