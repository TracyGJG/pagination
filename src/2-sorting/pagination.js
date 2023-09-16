export default function Pagination(
	sourceData = [],
	_columnSpecifications = []
) {
	if (!_columnSpecifications.length)
		throw Error('No Column Specifification provided');

	const rawData = structuredClone(sourceData);

	let reducedData;
	let organisedData;
	let pagedData;

	const columnSpecs = generateColumnPropertyLens(_columnSpecifications);
	let sortCriteria = extractSortableColumns(columnSpecs);

	let pageSize = 0;
	let pageNumber = 1;

	reduceData();
	organiseData();
	pageData();

	return {
		applyFilters(_filters = []) {},
		applySearches(_searchTerm = '') {},
		applySorting(_sortOrders = []) {
			pageNumber = 1;
			sortCriteria = extractSortCriteria(_sortOrders, columnSpecs);
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
		reducedData = rawData;
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

		return {
			pageNumber: pageNumber,
			numPages: maxPages,
			page: pagedData,
		};
	}
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
	return _columnSpecifications.map(colSpec => ({
		...colSpec,
		columnLens: propertyLens(colSpec),
	}));
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
