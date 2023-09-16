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

	describe('applyFilters', () => {
		test('No filtering', () => {
			const result = pagination.applyFilters();
			expect(result.page.length).toBe(300);
		});

		test('Single Filter', () => {
			const result = pagination.applyFilters([
				{
					column: 0,
					operation: 'matches',
					values: ['Japan'],
				},
			]);
			expect(result.page.length).toBe(50);
		});

		test('Double Filter', () => {
			const result = pagination.applyFilters([
				{
					column: 0,
					operation: 'matches',
					values: ['Japan'],
				},
				{
					column: 2,
					operation: 'less than',
					values: [50],
				},
			]);
			expect(result.page.length).toBe(4);
		});

		test('Search and Filter', () => {
			let result = pagination.applySearches('Distillery');
			expect(result.page.length).toBe(74);

			result = pagination.applyFilters([
				{
					column: 0,
					operation: 'matches',
					values: ['Japan'],
				},
				{
					column: 2,
					operation: 'less than',
					values: [50],
				},
			]);
			expect(result.page.length).toBe(2);
		});
	});
});
