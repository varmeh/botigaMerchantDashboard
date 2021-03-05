import * as Yup from 'yup'

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const numberErrorMessage = 'Please enter a number'
const dateErrorMessage = 'Please provide a valid date'
const positiveNumberMsg = 'Please enter positive value'

export const addProductValidators = Yup.object({
	productName: Yup.string().required('Required'),
	mrp: Yup.number()
		.test(
			'Is positive?',
			positiveNumberMsg,
			value => value === undefined || value === null || value >= 0
		)
		.typeError(numberErrorMessage),
	price: Yup.number()
		.test(
			'Is positive?',
			positiveNumberMsg,
			value => value === undefined || value === null || value >= 0
		)
		.required('Required')
		.typeError(numberErrorMessage),
	quantity: Yup.number()
		.test(
			'Is positive?',
			positiveNumberMsg,
			value => value === undefined || value === null || value >= 0
		)
		.required('Required')
		.typeError(numberErrorMessage),
	unit: Yup.string().required('Required'),
	description: Yup.string()
})

export const addCategoryValidators = Yup.object({
	category: Yup.string().required()
})

export const loginPhone = Yup.object({
	phone: Yup.string()
		.matches(phoneRegExp, 'Phone number is not valid')
		.required('requires 10 digit mobile number')
})

export const MAX_CHAR_CATEGORY = 24
export const MAX_CHAR_DESCRIPTION = 140

export const addCouponValidator = Yup.object({
	couponCode: Yup.string().required('Required'),
	discountType: Yup.string().required('Required').default('percentage'),
	discountValue: Yup.number()
		.test(
			'Is positive?',
			positiveNumberMsg,
			value => value === undefined || value === null || value >= 0
		)
		.required('Required')
		.typeError(numberErrorMessage),
	expiryDate: Yup.date().required('Required').typeError(dateErrorMessage),
	minimumOrderValue: Yup.number()
		.test(
			'Is positive?',
			positiveNumberMsg,
			value => value === undefined || value === null || value >= 0
		)
		.typeError(numberErrorMessage),
	maxDiscountAmount: Yup.number()
		.test(
			'Is positive?',
			positiveNumberMsg,
			value => value === undefined || value === null || value >= 0
		)
		.typeError(numberErrorMessage)
})

export const NUMBER_OF_BANNERS = 3
