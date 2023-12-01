// Let's allow only digits for the param
export function match(value) {
	return /^[0-9]+$/.test(value);
}