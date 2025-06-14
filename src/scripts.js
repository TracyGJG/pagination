import BirdData from "../data/bird-data.json" with { type: "json" };

import Paginate from "./pagination.js";

import {extractPage, renderTable} from "./utils.js";

const defaultCellSpec = (propName, cssClasses = '') => (obj) => `<td class="${cssClasses}">${obj[propName] ?? '-'}</td>`;
const speciesCellSpec = (bird) => `<td title="Species: ${bird.species}">${bird.family}</td>`;

const CELL_SPECS = [
  defaultCellSpec('id', '--centre'),
  defaultCellSpec('name'),
  speciesCellSpec,
  defaultCellSpec('place_of_found', '--centre'),
  defaultCellSpec('diet', '--centre'),
  defaultCellSpec('wingspan_cm', '--right'),
  defaultCellSpec('weight_kg', '--right'),
];


const RENDER_TABLE = renderTable("table", CELL_SPECS);
const EXTRACT_PAGE = extractPage(BirdData);

RENDER_TABLE(EXTRACT_PAGE().page);

const PAGINATE = Paginate(BirdData, CELL_SPECS);


const searchBar = document.querySelector('search-bar');

searchBar.addEventListener('clearSorting', () => {
  PAGINATE.clearSorting();
  document.querySelectorAll("table data-sorter").forEach((_sorter) => {
    _sorter.setAttribute("order", "unsorted");
    _sorter.setAttribute("level", 0);
  });
});

searchBar.addEventListener('clearFilters', () => {
  PAGINATE.clearFilters();
  document.querySelectorAll("table data-filter").forEach((_filter) => {
    _filter.setAttribute("mode", 'off');
  });
});

searchBar.addEventListener('applySearch', ({detail}) => {
  const {
    searchTerm,
    regExp,
  } = detail;
  PAGINATE.updateSearch(searchTerm, regExp);
});


document.querySelectorAll("table data-sorter").forEach(sorter => 
  sorter.addEventListener('sortOrderChanged', ({detail}) => {
    const {
      column,
      order,
      level,
    } = detail;
    PAGINATE.updateSorting(
      column,
      order,
      level
    );
  })
);

document.querySelectorAll("table data-filter").forEach(sorter => 
  sorter.addEventListener('filterChanged', ({detail}) => {
    const {
      column,
      values,
      isNull,
    } = detail;
    PAGINATE.updateFilter(column, values, isNull);
  })
);


const paginator = document.querySelector('#paginator');

paginator.addEventListener('paginatedSizeChange', ({detail: pageSize}) => {
  PAGINATE.updatePageSize(pageSize);
});

paginator.addEventListener('paginatedPageChange', ({detail: pageNum}) => {
  PAGINATE.updatePage(pageNum);
});
