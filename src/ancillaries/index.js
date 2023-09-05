import Columns from '../columns.json' assert { type: 'json' };
import Pagination from '../pagination.js';

(async () => {
	const Distilleries = await getData();
	console.table(Distilleries);
	const pagination = Pagination(Distilleries, Columns);
	const RatedNameCountry = [
		{
			colIndex: 4,
			order: 3,
			direction: -1,
		},
		{
			colIndex: 0,
			order: 2,
			direction: 1,
		},
		{
			colIndex: 5,
			order: 1,
			direction: 1,
		},
	];
	const RatedEstablishedDate = [
		{
			colIndex: 6,
			order: 2,
			direction: 1,
		},
		{
			colIndex: 5,
			order: 1,
			direction: 1,
		},
	];

	let result = pagination.applySorting(RatedEstablishedDate);
	result = pagination.applySearches('Distillery');

	result = pagination.applyFilters([
		{
			column: 2,
			operation: 'greater than',
			values: [50],
		},
	]);

	console.table(result.page);
})();

async function getData(url = '/Distilleries') {
	const data = await fetch(url);
	return (await data.json()).map(entry => ({
		...entry,
		rated: !!entry.whiskybase_rating,
		established: new Date(1900 - entry.name.length, 0, 1),
	}));
}
