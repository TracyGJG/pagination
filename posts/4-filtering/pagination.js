import filterOperations from './filterOperations/index.js';

export default function Pagination(
	sourceData = [],
	_columnSpecifications = []
) {
	if (!_columnSpecifications.length)
		throw Error('No Column Specifications provided');

	const rawData = structuredClone(sourceData);

	let reducedData;
	let organisedData;
	let pagedData;

	generateColumnPropertyLens(_columnSpecifications);
	const searchableColumns = extractSearchableColumns(_columnSpecifications);
	const lookupColumns = extractLookupColumns(_columnSpecifications);
	let sortCriteria = extractSortableColumns(_columnSpecifications);

	let searchTerm = '';
	let filterPredicates = [];
	let pageSize = 0;
	let pageNumber = 1;

	reduceData();
	organiseData();
	pageData();

	return {
		applyFilters(_filters = []) {
			pageNumber = 1;
			filterPredicates = generateFilterPredicates(
				_filters,
				_columnSpecifications
			);
			reduceData();
			organiseData();
			return pageData();
		},
		applySearches(_searchTerm = '') {
			pageNumber = 1;
			searchTerm = _searchTerm.toLowerCase();
			reduceData();
			organiseData();
			return pageData();
		},
		applySorting(_sortOrders = []) {
			pageNumber = 1;
			sortCriteria = extractSortCriteria(_sortOrders, _columnSpecifications);
			organiseData();
			return pageData();
		},
		applyPageNumber(_pageNumber = 1) {
			pageNumber = _pageNumber;
			return pageData();
		},
		applyPageSize(_pageSize = 0) {
			pageNumber = 1;
			pageSize = _pageSize;
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

		const lookups = extractLookupValues(lookupColumns, pagedData);

		return {
			pageNumber: pageNumber,
			numPages: maxPages,
			page: pagedData,
			lookups,
		};
	}
}

function extractLookupValues(lookupColumns, pagedData) {
	return lookupColumns.reduce(
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
}

function extractLookupColumns(_columnSpecs) {
	return _columnSpecs.filter(({ lookup }) => lookup);
}

function extractSearchableColumns(_columnSpecs) {
	return _columnSpecs.filter(
		({ searchable, type }) => searchable && type === 'string'
	);
}

function extractSortableColumns(_columnSpecifications) {
	return _columnSpecifications
		.reduce(
			(sortCri, colSpec) =>
				colSpec.sort.order ? { ...sortCri, colSpec } : sortCri,
			[]
		)
		.sort(arrangeSortOrder);
}

function generateColumnPropertyLens(_columnSpecifications) {
	_columnSpecifications.forEach(
		colSpec => (colSpec.columnLens = propertyLens(colSpec))
	);
}

function generateFilterPredicates(_filters, _columnSpecs) {
	return structuredClone(_filters).map(
		({ column, operation, values }) =>
			obj =>
				filterOperations[_columnSpecs[column].type][operation](...values)(
					_columnSpecs[column].columnLens(obj)
				)
	);
}

function extractSortCriteria(_sortOrders, _columnSpecs) {
	return _sortOrders
		.map(sortOrder => ({
			..._columnSpecs[sortOrder.colIndex],
			sort: {
				order: sortOrder.order,
				direction: sortOrder.direction,
			},
		}))
		.sort(arrangeSortOrder);
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
