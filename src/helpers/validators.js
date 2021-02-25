import * as Yup from 'yup';

export const addProductValidators = Yup.object({
  productName: Yup.string().required('Required'),
  mrp: Yup.number().typeError('You must specify a number'),
  price: Yup.number().required('Required').typeError('You must specify a number'),
  quantity: Yup.number().required('Required').typeError('You must specify a number'),
  unit: Yup.string().required('Required'),
  description: Yup.string().max(140)
});

export const addCategoryValidators = Yup.object({
  category: Yup.string().max(24).required('Required')
});

export const loginPhone = Yup.object({
  phone: Yup.number().max(10).required('Requires 10 digit mobile number').typeError('You must specify a number')
});