import * as Yup from 'yup';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const addProductValidators = Yup.object({
  productName: Yup.string().required('Required'),
  mrp: Yup.number().typeError('You must specify a number'),
  price: Yup.number().required('Required').typeError('You must specify a number'),
  quantity: Yup.number().required('Required').typeError('You must specify a number'),
  unit: Yup.string().required('Required'),
  description: Yup.string()
});

export const addCategoryValidators = Yup.object({
  category: Yup.string().required()
});

export const loginPhone = Yup.object({
  phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required('requires 10 digit mobile number')
});

export const MAX_CHAR_CATEGORY = 24;
export const MAX_CHAR_DESCRIPTION = 140;