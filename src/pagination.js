/*
colSpec = {
  propertyName: {
    "type": "string",
    "searchable": true,
    "filterable": true,
    "nullable": false
  },
};
*/

export default function Paginate(dataset, colSpecs = {}, initPageSize = 5) {
  const properties = {
    data: structuredClone(dataset),
    page: 1,
    size: initPageSize,
    sorting: {},
    filters: {},
    searchTerm: "",
    regExp: false,
  };

  return {
    refreshData(_data) {
      properties.data = _data;
      properties.page = 1;
      return extractPage();
    },
    clearSorting() {
      properties.sorting = {};
      return extractPage();
    },
    clearFilters() {
      properties.filters = {};
      return extractPage();
    },
    updatePage(_page) {
      properties.page = _page;
      return extractPage();
    },
    updatePageSize(_size) {
      properties.size = _size;
      properties.page = 1;
      return extractPage();
    },
    updateSorting(_column, _order, _level) {
      if (_order === "unsorted" && properties.sorting[_column]) {
        delete properties.sorting[_column];
      } else {
        properties.sorting[_column] = {
          order: _order,
          level: _level,
        };
      }
      return extractPage();
    },
    updateFilter(_column, _params, _isNull) {
      if (!_params && properties.filters[_column]) {
        delete properties.filters[_column];
      } else {
        properties.filters[_column] = {
          params: _params,
          isNull: _isNull,
        };
      }
      return extractPage();
    },
    updateSearch(_searchTerm, _regExp) {
      properties.searchTerm = _searchTerm.toLowerCase();
      properties.regExp = _regExp;
      return extractPage();
    },
  };

  function extractPage() {
    console.log(`extractPage:
  Page=${properties.page},
  PageSize=${properties.size},
  SearchTerm=${properties.searchTerm},
  RegExp=${properties.regExp},
  Sorting=${JSON.stringify(properties.sorting)},
  Filters=${JSON.stringify(properties.filters)}`);

    // reduce rows: Search and Filter
    // organise rows: Sort
    // extract page: Number and Size
  }
}
