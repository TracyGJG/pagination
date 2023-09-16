import filterOperations from './filterOperations.js';

describe('filterOperations', () => {
	describe('(boolean)', () => {
		test('is false', () => {
			expect(filterOperations.boolean['is false']()(false)).toStrictEqual(true);
			expect(filterOperations.boolean['is false']()(true)).toStrictEqual(false);
		});
		test('is true', () => {
			expect(filterOperations.boolean['is true']()(false)).toStrictEqual(false);
			expect(filterOperations.boolean['is true']()(true)).toStrictEqual(true);
		});
	});

	describe('(date)', () => {
		const alpha = new Date(2020, 0, 1);
		const beta = new Date(2021, 0, 1);
		const gamma = new Date(2022, 0, 1);

		test('after', () => {
			expect(filterOperations.date.after(beta)(gamma)).toStrictEqual(true);
			expect(filterOperations.date.after(beta)(beta)).toStrictEqual(false);
			expect(filterOperations.date.after(beta)(alpha)).toStrictEqual(false);
		});
		test('before', () => {
			expect(filterOperations.date.before(beta)(gamma)).toStrictEqual(false);
			expect(filterOperations.date.before(beta)(beta)).toStrictEqual(false);
			expect(filterOperations.date.before(beta)(alpha)).toStrictEqual(true);
		});
		test('between', () => {
			expect(filterOperations.date.between(alpha, beta)(gamma)).toStrictEqual(
				false
			);
			expect(filterOperations.date.between(beta, gamma)(alpha)).toStrictEqual(
				false
			);
			expect(filterOperations.date.between(alpha, gamma)(alpha)).toStrictEqual(
				true
			);
			expect(filterOperations.date.between(alpha, gamma)(beta)).toStrictEqual(
				true
			);
			expect(filterOperations.date.between(alpha, gamma)(gamma)).toStrictEqual(
				true
			);
		});
		test('in between', () => {
			expect(
				filterOperations.date['in between'](alpha, beta)(gamma)
			).toStrictEqual(false);
			expect(
				filterOperations.date['in between'](beta, gamma)(alpha)
			).toStrictEqual(false);
			expect(
				filterOperations.date['in between'](alpha, gamma)(alpha)
			).toStrictEqual(false);
			expect(
				filterOperations.date['in between'](alpha, gamma)(beta)
			).toStrictEqual(true);
			expect(
				filterOperations.date['in between'](alpha, gamma)(gamma)
			).toStrictEqual(false);
		});
		test('on or after', () => {
			expect(filterOperations.date['on or after'](beta)(gamma)).toStrictEqual(
				true
			);
			expect(filterOperations.date['on or after'](beta)(alpha)).toStrictEqual(
				false
			);
			expect(filterOperations.date['on or after'](beta)(beta)).toStrictEqual(
				true
			);
		});
		test('on or before', () => {
			expect(filterOperations.date['on or before'](beta)(gamma)).toStrictEqual(
				false
			);
			expect(filterOperations.date['on or before'](beta)(alpha)).toStrictEqual(
				true
			);
			expect(filterOperations.date['on or before'](beta)(beta)).toStrictEqual(
				true
			);
		});
		test('on', () => {
			expect(filterOperations.date.on(beta)(gamma)).toStrictEqual(false);
			expect(filterOperations.date.on(beta)(alpha)).toStrictEqual(false);
			expect(filterOperations.date.on(beta)(beta)).toStrictEqual(true);
		});
	});

	describe('(number)', () => {
		test('between', () => {
			expect(filterOperations.number.between(4.2, 420)(42)).toStrictEqual(true);
			expect(filterOperations.number.between(4.2, 420)(4.2)).toStrictEqual(
				true
			);
			expect(filterOperations.number.between(4.2, 420)(420)).toStrictEqual(
				true
			);
			expect(filterOperations.number.between(4.2, 420)(4.1)).toStrictEqual(
				false
			);
			expect(filterOperations.number.between(4.2, 420)(420.1)).toStrictEqual(
				false
			);
		});
		test('equal to', () => {
			expect(filterOperations.number['equal to'](42)(42)).toStrictEqual(true);
			expect(filterOperations.number['equal to'](42)(42.1)).toStrictEqual(
				false
			);
			expect(filterOperations.number['equal to'](42)(41.9)).toStrictEqual(
				false
			);
		});
		test('greater than', () => {
			expect(filterOperations.number['greater than'](42)(42)).toStrictEqual(
				false
			);
			expect(filterOperations.number['greater than'](42)(42.1)).toStrictEqual(
				true
			);
			expect(filterOperations.number['greater than'](42)(41.9)).toStrictEqual(
				false
			);
		});
		test('greater than or equal to', () => {
			expect(
				filterOperations.number['greater than or equal to'](42)(42)
			).toStrictEqual(true);
			expect(
				filterOperations.number['greater than or equal to'](42)(42.1)
			).toStrictEqual(true);
			expect(
				filterOperations.number['greater than or equal to'](42)(41.9)
			).toStrictEqual(false);
		});
		test('less than', () => {
			expect(filterOperations.number['less than'](42)(42)).toStrictEqual(false);
			expect(filterOperations.number['less than'](42)(42.1)).toStrictEqual(
				false
			);
			expect(filterOperations.number['less than'](42)(41.9)).toStrictEqual(
				true
			);
		});
		test('less than or equal to', () => {
			expect(
				filterOperations.number['less than or equal to'](42)(42)
			).toStrictEqual(true);
			expect(
				filterOperations.number['less than or equal to'](42)(42.1)
			).toStrictEqual(false);
			expect(
				filterOperations.number['less than or equal to'](42)(41.9)
			).toStrictEqual(true);
		});
		test('not equal to', () => {
			expect(filterOperations.number['not equal to'](42)(42)).toStrictEqual(
				false
			);
			expect(filterOperations.number['not equal to'](42)(42.1)).toStrictEqual(
				true
			);
			expect(filterOperations.number['not equal to'](42)(41.9)).toStrictEqual(
				true
			);
		});
	});

	describe('(string)', () => {
		test('ends with', () => {
			expect(filterOperations.string['ends with']('st')('Test')).toStrictEqual(
				true
			);
			expect(filterOperations.string['ends with']('Te')('Test')).toStrictEqual(
				false
			);
		});
		test('excludes', () => {
			expect(filterOperations.string.excludes('Tt')('Test')).toStrictEqual(
				true
			);
			expect(filterOperations.string.excludes('es')('Test')).toStrictEqual(
				false
			);
		});
		test('includes', () => {
			expect(filterOperations.string.includes('es')('Test')).toStrictEqual(
				true
			);
			expect(filterOperations.string.includes('Tt')('Test')).toStrictEqual(
				false
			);
		});
		test('look-up', () => {
			expect(
				filterOperations.string['look-up'](['alpha', 'beta', 'gamma'])('gamma')
			).toStrictEqual(true);
			expect(
				filterOperations.string['look-up'](['alpha', 'beta', 'gamma'])('delta')
			).toStrictEqual(false);
		});
		test('matches', () => {
			expect(filterOperations.string.matches('Test')('Test')).toStrictEqual(
				true
			);
			expect(filterOperations.string.matches('tseT')('Test')).toStrictEqual(
				false
			);
		});
		test('starts with', () => {
			expect(
				filterOperations.string['starts with']('Te')('Test')
			).toStrictEqual(true);
			expect(
				filterOperations.string['starts with']('st')('Test')
			).toStrictEqual(false);
		});
	});
});
