import BirdData from "../data/bird-data.json" with { type: "json" };
import {extractPage, renderTable} from "./utils.js";
import Paginate from "./pagination.js";

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

const PAGINATE = Paginate();

const paginator = document.querySelector('#paginator');
paginator.pages = 3;

paginator.addEventListener('paginatedSizeChange', ({detail: pageSize}) => {
  PAGINATE.updatePageSize(pageSize);
});

paginator.addEventListener('paginatedPageChange', ({detail: pageNum}) => {
  PAGINATE.updatePage(pageNum);
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