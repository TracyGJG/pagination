import filterOperations from './filterOperations/index.js';

export default function Pagination(
	sourceData = [],
	_columnSpecifications = []
) {
	if (!_columnSpecifications.length)
		throw Error('No Column Specifification provided');

	const rawData = structuredClone(sourceData);
	const columnSpecifications = _columnSpecifications.map(colSpec => ({
		...colSpec,
		columnLens: propertyLens(colSpec),
	}));

	let searchTerm = '';
	const searchableColumns = columnSpecifications.filter(
		({ searchable, type }) => searchable && type === 'string'
	);

	let filterPredicates = [];
	const lookupColumns = columnSpecifications.filter(({ lookup }) => lookup);
	let reducedData;

	let sortCriteria = columnSpecifications
		.reduce(
			(sortCri, colSpec) =>
				colSpec.sort.order ? { ...sortCri, colSpec } : sortCri,
			[]
		)
		.sort(arrangeSortOrder);
	let organisedData;

	let pageSize = 0;
	let pageNumber = 1;
	let pagedData;

	reduceData();
	organiseData();
	pageData();

	return {
		applySearches(_searchTerm = '') {
			pageNumber = 1;
			searchTerm = _searchTerm.toLowerCase();
			reduceData();
			organiseData();
			return pageData();
		},
		applyFilters(_filters = []) {
			pageNumber = 1;
			filterPredicates = structuredClone(_filters).map(
				({ column, operation, values }) =>
					obj =>
						filterOperations[columnSpecifications[column].type][operation](
							...values
						)(columnSpecifications[column].columnLens(obj))
			);
			reduceData();
			organiseData();
			return pageData();
		},
		applySorting(_sortOrders = []) {
			pageNumber = 1;
			sortCriteria = _sortOrders
				.map(sortOrder => ({
					...columnSpecifications[sortOrder.colIndex],
					sort: {
						order: sortOrder.order,
						direction: sortOrder.direction,
					},
				}))
				.sort(arrangeSortOrder);

			organiseData();
			return pageData();
		},
		applyPageSize(_pageSize = 0) {
			pageNumber = 1;
			pageSize = _pageSize;
			return pageData();
		},
		applyPageNumber(_pageNumber = 1) {
			pageNumber = _pageNumber;
			return pageData();
		},
	};

	function reduceData() {
		pageNumber = 1;
		reducedData = rawData.filter(
			datum =>
				filterPredicates.every(filter => filter(datum)) &&
				(searchTerm === '' ||
					searchableColumns.some(({ columnLens }) =>
						columnLens(datum).toLowerCase().includes(searchTerm)
					))
		);
	}

	function organiseData() {
		pageNumber = 1;
		organisedData = structuredClone(reducedData);
		sortCriteria.length && organisedData.sort(cascadedSort(sortCriteria));
	}

	function pageData() {
		let page;
		let pageStart = 0;
		let maxPages = 1;

		if (pageSize) {
			page = pageNumber * pageSize;
			maxPages = Math.ceil(organisedData.length / pageSize);
			pageStart = page - pageSize;
		}
		pagedData = organisedData.slice(pageStart, page);

		const lookups = lookupColumns.reduce(
			(_lookups, lookupColumn) => ({
				..._lookups,
				[lookupColumn.property]: [
					...new Set(
						pagedData.map(obj =>
							({
								boolean: _ => `${_ === false}`,
								date: _ => `${_.toISOString()}`,
								number: _ => `${_}`,
								string: _ => _,
							}[lookupColumn.type](lookupColumn.columnLens(obj)))
						)
					),
				].sort(),
			}),
			{}
		);

		return {
			pageNumber: pageNumber,
			numPages: maxPages,
			page: pagedData,
			lookups,
		};
	}
}

function cascadedSort(_sortCriteria) {
	const type = {
		boolean: _ => `${_}`.toLowerCase() === 'false',
		date: _ => `${new Date(_).toISOString()}`,
		number: _ => +_,
		string: _ => _,
	};
	return _cascadedSort(..._sortCriteria);

	function _cascadedSort(_sortCriterion, ..._rest) {
		const columnLens = _sortCriterion.columnLens;
		const propertyType = type[_sortCriterion.type];
		const direction = _sortCriterion.sort.direction;

		return (objA, objB) => {
			const propertyA = propertyType(columnLens(objA));
			const propertyB = propertyType(columnLens(objB));
			const order =
				+(propertyA > propertyB) + -(propertyA < propertyB) ||
				(_rest.length ? _cascadedSort(..._rest)(objA, objB) : 0);
			return order * direction;
		};
	}
}

function propertyLens({ property }) {
	return obj => obj[property];
}

function arrangeSortOrder(colSpecA, colSpecB) {
	return colSpecA.sort.order - colSpecB.sort.order;
}
