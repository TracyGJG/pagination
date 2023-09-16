import Distilleries from '../db.json';
import Columns from './columns.json';
import Pagination from './pagination.js';

describe('Pagination', () => {
	let pagination;

	beforeEach(() => {
		pagination = Pagination(
			Distilleries.map(entry => ({
				...entry,
				rated: !!entry.whiskybase_rating,
				established: new Date(1900 - entry.name.length, 0, 1),
			})),
			Columns
		);
	});

	describe('applySearches', () => {
		test('no term supplied', () => {
			const result = pagination.applySearches();
			expect(result.page.length).toBe(300);
		});

		test('very specific term supplied (Abbeyhill Distillery)', () => {
			const result = pagination.applySearches('Abbeyhill Distillery');
			expect(result.page.length).toBe(1);
		});

		test('generic term supplied (Distillery)', () => {
			const result = pagination.applySearches('Distillery');
			expect(result.page.length).toBe(74);
		});

		test('specific term supplied (Japan)', () => {
			const result = pagination.applySearches('Japan');
			expect(result.page.length).toBe(50);
		});

		test('less specific term supplied (pan)', () => {
			const result = pagination.applySearches('pan');
			expect(result.page.length).toBe(51);
		});

		test('ultra generic term supplied (an)', () => {
			const result = pagination.applySearches('an');
			expect(result.page.length).toBe(300);
		});
	});
});
