import Distilleries from '../db.json';
import Pagination from './pagination.js';

describe('Pagination', () => {
	describe('preparation', () => {
		test('have data', () => {
			expect(Distilleries.length).toBe(300);
		});

		test('Insufficient column specification', () => {
			const exceptionTest = () => Pagination(Distilleries);

			expect(exceptionTest).toThrow('No Column Specifification provided');
		});
	});
});
