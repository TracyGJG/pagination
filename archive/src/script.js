import Distilleries from '../posts/db.json' assert { type: 'json' };
import Columns from '../posts/4-filtering/columns.json' assert { type: 'json' };
import Headings from './headings.json' assert { type: 'json' };
import Pagination from '../posts/4-filtering/pagination.js';

const pagination = Pagination(
	Distilleries.map(entry => ({
		...entry,
		rated: !!entry.whiskybase_rating,
		established: new Date(1900 - entry.name.length, 0, 1),
	})),
	Columns
);

const format = {
	string: _ => _,
	floorPercent: _ => `${Math.floor(+_)}%`,
	number: _ => +_,
	yesNo: _ => (_ ? 'Yes' : 'No'),
	fourDigitYear: _ => _.getUTCFullYear(),
};

updatePagination(pagination.applyPageNumber(1));

function configurePageSize(domPageSize) {
	domPageSize.addEventListener('change', evt => {
		updatePagination(pagination.applyPageSize(+evt.target.value));
	});
}

function configureSearching(domSearch) {
	domSearch.children[1].addEventListener('click', _ => {
		updatePagination(pagination.applySearches(domSearch.children[0].innerText));
	});
	domSearch.children[2].addEventListener('click', _ => {
		domSearch.children[0].innerText = '';
		updatePagination(pagination.applySearches());
	});
}

function configurePageControl(domPageControl) {
	const controlButtons = {
		F: (curr, last) => 1,
		P: (curr, last) => curr - 1,
		N: (curr, last) => curr + 1,
		L: (curr, last) => last,
	};

	domPageControl.addEventListener('click', evt => {
		if (evt.target.tagName === 'BUTTON') {
			updatePagination(
				pagination.applyPageNumber(
					controlButtons[evt.target.accessKey](
						+pageNum.value,
						pageNum.children.length
					)
				)
			);
		}
	});

	pageNum.addEventListener('change', evt => {
		updatePagination(pagination.applyPageNumber(+evt.target.value));
	});
}

function renderHeader() {
	page.children[0].innerHTML = `<tr>${Headings.map(
		({ title }) => `<th><span>${title}</span></th>`
	).join('')}</tr>`;
}

function renderBody(pageResult) {
	return pageResult.page
		.map(
			rowObj =>
				`<tr>${Columns.map(
					({ columnLens }, colIndex) =>
						`<td style="--justification:${
							Headings[colIndex].justification
						}">${format[Headings[colIndex].format](columnLens(rowObj))}</td>`
				).join('')}</tr>`
		)
		.join('');
}

renderHeader();
configureSearching(search);
configurePageSize(pageSize);
configurePageControl(pageControl);

function updatePagination(pageResult) {
	// console.dir(pageResult);
	page.children[1].innerHTML = renderBody(pageResult);
	updatePageControl(pageResult);
}

function updatePageControl({ pageNumber, numPages }) {
	pageControl.dataset.mode = '';
	if (numPages === 1) {
		pageControl.dataset.mode = '0';
	} else if (pageNumber === 1) {
		pageControl.dataset.mode = '1';
	} else if (pageNumber === numPages) {
		pageControl.dataset.mode = '-1';
	}
	pageNum.innerHTML = [...Array(numPages).keys()]
		.map(key => `<option value="${key + 1}">Page ${key + 1}</option>`)
		.join('');
	pageNum.value = pageNumber;
}
