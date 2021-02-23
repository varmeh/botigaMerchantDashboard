import * as Yup from 'yup';

export const addProductValidators = Yup.object({
  productName: Yup.string().required('Required'),
  mrp: Yup.number(),
  price: Yup.number().required('Required'),
  quantity: Yup.number().required('Required'),
  unit: Yup.string().required('Required'),
  description: Yup.string().max(140)
});

export const addCategoryValidators = Yup.object({
  category: Yup.string().max(24).required('Required')
});

export const loginPhone = Yup.object({
  phone: Yup.string().max(10).required('Requires 10 digit mobile number')
});