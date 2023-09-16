const filterOperations = {
	boolean: {
		'is false': _ => val => !val,
		'is true': _ => val => !!val,
	},
	date: {
		after: threshold => val => val > threshold,
		before: threshold => val => val < threshold,
		between: (min, max) => val => val >= min && val <= max,
		'in between': (min, max) => val => val > min && val < max,
		'on or after': threshold => val => val >= threshold,
		'on or before': threshold => val => val <= threshold,
		on: threshold => val => val === threshold,
	},
	number: {
		between: (min, max) => val => val >= min && val <= max,
		'equal to': threshold => val => val === threshold,
		'greater than': threshold => val => val > threshold,
		'greater than or equal to': threshold => val => val >= threshold,
		'less than': threshold => val => val < threshold,
		'less than or equal to': threshold => val => val <= threshold,
		'not equal to': threshold => val => val !== threshold,
	},
	string: {
		'ends with': text => val => val.endsWith(text),
		excludes: text => val => !val.includes(text),
		includes: text => val => val.includes(text),
		'look-up': selections => val => selections.includes(val),
		matches: text => val => val === text,
		'starts with': text => val => val.startsWith(text),
	},
};

export default filterOperations;
