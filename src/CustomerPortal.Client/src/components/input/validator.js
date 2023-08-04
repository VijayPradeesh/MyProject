export const numberOnly = value => {
	return value.replace(/[^0-9]/g, '');
};

export const checkEmail = value => {
	const regex = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
	return value.match(regex);
};

export const checkPassword = value => {
	const regex = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[_!@#$%^&*?]).{12,}$'
	return value.match(regex);
}