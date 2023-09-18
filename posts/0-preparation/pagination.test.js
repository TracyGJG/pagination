import Distilleries from '../db.json';
import Pagination from './pagination.js';

describe('Pagination', () => {
	describe('preparation', () => {
		test('Insufficient column specifications', () => {
			expect(Distilleries.length).toBe(300);

			const exceptionTest = () => Pagination(Distilleries);

			expect(exceptionTest).toThrow('No Column Specifications provided');
		});
	});
});
