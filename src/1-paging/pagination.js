export default function Pagination(sourceData = []) {
	const rawData = structuredClone(sourceData);

	let reducedData;
	let organisedData;
	let pagedData;

	let pageSize = 0;
	let pageNumber = 1;

	reduceData();
	organiseData();
	pageData();

	return {
		applyFilters(_filters = []) {},
		applySearches(_searchTerm = '') {},
		applySorting(_sortOrders = []) {},
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
		reducedData = rawData;
	}

	function organiseData() {
		organisedData = reducedData;
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
