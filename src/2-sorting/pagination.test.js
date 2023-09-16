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

	describe('applySorting', () => {
		test('Default parameters', () => {
			const result = pagination.applySorting();
			expect(result.pageNumber).toBe(1);
			expect(result.numPages).toBe(1);
			expect(result.page.length).toBe(300);
			expect(result.page[0].slug).toBe('8_doors');
			expect(result.page[299].slug).toBe('yuza');
		});

		test('Single Sort Criteria (string)', () => {
			const result = pagination.applySorting([
				{
					colIndex: 0,
					order: 1,
					direction: 1,
				},
			]);
			expect(result.pageNumber).toBe(1);
			expect(result.numPages).toBe(1);
			expect(result.page.length).toBe(300);
			expect(result.page[0].country).toBe('Japan');
			expect(result.page[0].name).toBe('Aioi Unibio Co. Ltd.');
			expect(result.page[49].country).toBe('Japan');
			expect(result.page[49].name).toBe('Yuza Distillery');
			expect(result.page[50].country).toBe('Scotland');
			expect(result.page[50].name).toBe('8 Doors Distillery');
			expect(result.page[294].country).toBe('Scotland');
			expect(result.page[294].name).toBe('Wolfburn');
			expect(result.page[295].country).toBe('Taiwan');
			expect(result.page[295].name).toBe('Benson Winery');
			expect(result.page[299].country).toBe('Taiwan');
			expect(result.page[299].name).toBe('Taichung');
		});

		test('Single Sort Criteria (number)', () => {
			const result = pagination.applySorting([
				{
					colIndex: 4,
					order: 1,
					direction: 1,
				},
			]);
			expect(result.pageNumber).toBe(1);
			expect(result.numPages).toBe(1);
			expect(result.page.length).toBe(300);
			expect(result.page[0].country).toBe('Scotland');
			expect(result.page[0].name).toBe('Abbeyhill Distillery');
			expect(result.page[0].whiskybase_whiskies).toBe(0);
			expect(result.page[49].country).toBe('Japan');
			expect(result.page[49].name).toBe('THE ONTAKE DISTILLERY');
			expect(result.page[49].whiskybase_whiskies).toBe(0);
			expect(result.page[50].country).toBe('Scotland');
			expect(result.page[50].name).toBe('Toberanrigh Distillery');
			expect(result.page[50].whiskybase_whiskies).toBe(0);
			expect(result.page[294].country).toBe('Scotland');
			expect(result.page[294].name).toBe('Bowmore');
			expect(result.page[294].whiskybase_whiskies).toBe(3720);
			expect(result.page[295].country).toBe('Scotland');
			expect(result.page[295].name).toBe('Bunnahabhain');
			expect(result.page[295].whiskybase_whiskies).toBe(3754);
			expect(result.page[299].country).toBe('Scotland');
			expect(result.page[299].name).toBe('Caol Ila');
			expect(result.page[299].whiskybase_whiskies).toBe(5993);
		});

		test('Single Sort Criteria (boolean)', () => {
			const result = pagination.applySorting([
				{
					colIndex: 5,
					order: 1,
					direction: 1,
				},
			]);
			expect(result.pageNumber).toBe(1);
			expect(result.numPages).toBe(1);
			expect(result.page.length).toBe(300);
			expect(result.page[0].country).toBe('Scotland');
			expect(result.page[0].name).toBe('8 Doors Distillery');
			expect(result.page[0].whiskybase_whiskies).toBe(4);
			expect(result.page[49].country).toBe('Japan');
			expect(result.page[49].name).toBe('Chugoku Jozo');
			expect(result.page[49].whiskybase_whiskies).toBe(18);
			expect(result.page[50].country).toBe('Scotland');
			expect(result.page[50].name).toBe('Clynelish');
			expect(result.page[50].whiskybase_whiskies).toBe(2334);
			expect(result.page[294].country).toBe('Scotland');
			expect(result.page[294].name).toBe('Toberanrigh Distillery');
			expect(result.page[294].whiskybase_whiskies).toBe(0);
			expect(result.page[295].country).toBe('Scotland');
			expect(result.page[295].name).toBe('Toulvaddie');
			expect(result.page[295].whiskybase_whiskies).toBe(0);
			expect(result.page[299].country).toBe('Japan');
			expect(result.page[299].name).toBe('Yamaga');
			expect(result.page[299].whiskybase_whiskies).toBe(2);
		});

		test('Single Sort Criteria (date)', () => {
			const result = pagination.applySorting([
				{
					colIndex: 6,
					order: 1,
					direction: 1,
				},
			]);
			expect(result.pageNumber).toBe(1);
			expect(result.numPages).toBe(1);
			expect(result.page.length).toBe(300);
			expect(result.page[0].country).toBe('Scotland');
			expect(result.page[0].name).toBe('The Lindores Distilling Co. Ltd.');
			expect(result.page[0].whiskybase_whiskies).toBe(89);
			expect(result.page[49].country).toBe('Scotland');
			expect(result.page[49].name).toBe('Highland Distillery');
			expect(result.page[49].whiskybase_whiskies).toBe(0);
			expect(result.page[50].country).toBe('Scotland');
			expect(result.page[50].name).toBe('Holyrood Distillery');
			expect(result.page[50].whiskybase_whiskies).toBe(20);
			expect(result.page[294].country).toBe('Scotland');
			expect(result.page[294].name).toBe('Daill');
			expect(result.page[294].whiskybase_whiskies).toBe(0);
			expect(result.page[295].country).toBe('Japan');
			expect(result.page[295].name).toBe('Hanyu');
			expect(result.page[295].whiskybase_whiskies).toBe(205);
			expect(result.page[299].country).toBe('Scotland');
			expect(result.page[299].name).toBe('Oban');
			expect(result.page[299].whiskybase_whiskies).toBe(242);
		});

		test('Dual Sort Criteria (string)', () => {
			const result = pagination.applySorting([
				{
					colIndex: 1,
					order: 2,
					direction: -1,
				},
				{
					colIndex: 0,
					order: 1,
					direction: 1,
				},
			]);
			expect(result.pageNumber).toBe(1);
			expect(result.numPages).toBe(1);
			expect(result.page.length).toBe(300);
			expect(result.page[0].country).toBe('Japan');
			expect(result.page[0].name).toBe('Yuza Distillery');
			expect(result.page[49].country).toBe('Japan');
			expect(result.page[49].name).toBe('Aioi Unibio Co. Ltd.');
			expect(result.page[50].country).toBe('Scotland');
			expect(result.page[50].name).toBe('Wolfburn');
			expect(result.page[294].country).toBe('Scotland');
			expect(result.page[294].name).toBe('8 Doors Distillery');
			expect(result.page[295].country).toBe('Taiwan');
			expect(result.page[295].name).toBe('Taichung');
			expect(result.page[299].country).toBe('Taiwan');
			expect(result.page[299].name).toBe('Benson Winery');
		});

		test('Dual Sort Criteria (string & number)', () => {
			const result = pagination.applySorting([
				{
					colIndex: 4,
					order: 2,
					direction: 1,
				},
				{
					colIndex: 0,
					order: 1,
					direction: 1,
				},
			]);
			expect(result.pageNumber).toBe(1);
			expect(result.numPages).toBe(1);
			expect(result.page.length).toBe(300);
			expect(result.page[0].country).toBe('Japan');
			expect(result.page[0].name).toBe('Sakurao');
			expect(result.page[0].whiskybase_whiskies).toBe(0);
			expect(result.page[49].country).toBe('Japan');
			expect(result.page[49].name).toBe('Karuizawa');
			expect(result.page[49].whiskybase_whiskies).toBe(732);
			expect(result.page[50].country).toBe('Scotland');
			expect(result.page[50].name).toBe('Abbeyhill Distillery');
			expect(result.page[50].whiskybase_whiskies).toBe(0);
			expect(result.page[294].country).toBe('Scotland');
			expect(result.page[294].name).toBe('Caol Ila');
			expect(result.page[294].whiskybase_whiskies).toBe(5993);
			expect(result.page[295].country).toBe('Taiwan');
			expect(result.page[295].name).toBe('Benson Winery');
			expect(result.page[295].whiskybase_whiskies).toBe(1);
			expect(result.page[299].country).toBe('Taiwan');
			expect(result.page[299].name).toBe('Kavalan');
			expect(result.page[299].whiskybase_whiskies).toBe(3315);
		});
	});
});
