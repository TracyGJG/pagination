export function renderTable(tableSelector, cellSpecs) {
  const DOM_TABLE = document.querySelector(`${tableSelector} tbody`);

  return (dataRows) => {
    DOM_TABLE.innerHTML = dataRows.map(renderRow).join("");
  };

  function renderRow(dataRow) {
    return `<tr>
      ${cellSpecs.map((cellSpec) => cellSpec(dataRow)).join("")}
    </tr>`;
  }
}

export function extractPage(dataset, initPageSize = 5) {
  const INITIAL_PAGE = 1;
  let _page = INITIAL_PAGE;
  let _size = initPageSize;

  return function (page, size) {
    _page = page ?? _page;
    _size = size ?? _size;

    return {
      page: _size ? dataset.slice((_page - 1) * _size, _page * _size) : dataset,
      pages: _size ? Math.ceil(dataset.length / _size) : INITIAL_PAGE,
    };
  };
}
