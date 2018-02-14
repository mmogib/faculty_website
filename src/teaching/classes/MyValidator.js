import validator from 'validator'

export default {
	isValidYear: value => {
		return (
			validator.isNumeric(value) && validator.isLength(value, { min: 4, max: 4 })
		)
	},

	isAlphanumeric: value => {
		return validator.isAlphanumeric(value)
	}
}
