export default function Pagination(
	sourceData = [],
	_columnSpecifications = []
) {
	if (!_columnSpecifications.length)
		throw Error('No Column Specifications provided');
	return {};
}
