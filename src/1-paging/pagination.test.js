import Distilleries from '../db.json';
import Pagination from './pagination.js';

describe('Pagination', () => {
	let pagination;

	beforeEach(() => {
		pagination = Pagination(
			Distilleries.map(entry => ({
				...entry,
				rated: !!entry.whiskybase_rating,
				established: new Date(1900 - entry.name.length, 0, 1),
			}))
		);
	});

	describe('applyPageSize', () => {
		test('Default parameters', () => {
			const result = pagination.applyPageSize();
			expect(result.pageNumber).toBe(1);
			expect(result.numPages).toBe(1);
			expect(result.page.length).toBe(300);
			expect(result.page[0].slug).toBe('8_doors');
			expect(result.page[299].slug).toBe('yuza');
		});

		test('Set page size', () => {
			const result = pagination.applyPageSize(20);
			expect(result.pageNumber).toBe(1);
			expect(result.numPages).toBe(15);
			expect(result.page.length).toBe(20);
			expect(result.page[0].slug).toBe('8_doors');
			expect(result.page[19].slug).toBe('ardnamurchan');
		});

		test('New page size', () => {
			const result = pagination.applyPageSize(32);
			expect(result.pageNumber).toBe(1);
			expect(result.numPages).toBe(10);
			expect(result.page.length).toBe(32);
			expect(result.page[0].slug).toBe('8_doors');
			expect(result.page[31].slug).toBe('balvenie');
		});

		test('New page number', () => {
			let result = pagination.applyPageSize(16);
			result = pagination.applyPageNumber(19);
			expect(result.pageNumber).toBe(19);
			expect(result.numPages).toBe(19);
			expect(result.page.length).toBe(12);
			expect(result.page[0].slug).toBe('tsunuki');
			expect(result.page[11].slug).toBe('yuza');
		});
	});

	describe('applyPageNumber', () => {
		test('Reset page size', () => {
			const result = pagination.applyPageNumber();
			expect(result.pageNumber).toBe(1);
			expect(result.numPages).toBe(1);
			expect(result.page.length).toBe(300);
			expect(result.page[0].slug).toBe('8_doors');
			expect(result.page[299].slug).toBe('yuza');
		});
	});
});
