import * as Yup from 'yup';

export const addProductValidators = Yup.object({
    productName: Yup.string().required('Required'),
    categoryId:Yup.string().required('Required'),
    price:Yup.number().required('Required'),
    quantity: Yup.number().required("Required"),
    unit: Yup.string().required('Required'),
    description: Yup.string()  
  });