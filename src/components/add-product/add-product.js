import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone'
import { Formik } from 'formik';
import { addProductValidators } from "../../helpers/validators";
import { fetchCategories } from "../../services/category-service";
import { getPresignedImageUrl,uploadImageToS3 } from "../../services/common-service";
import { saveProduct } from "../../services/product-service";


function ProductImage(props) {
    const onDrop = useCallback(acceptedFiles => {
        props.setPreviewImage(acceptedFiles.shift());
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag 'n' drop some files here, or click to select files</p>
            }
        </div>
    );
}

export function AddProduct() {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [categories, setCategories] = useState([]);
    const [imageUrl, setImageUrl] = useState({ uploadUrl: '', downloadUrl: '' });
    const [previewImage, setPreviewImage] = useState(null);
    const units = ['kg', 'gms', 'lt', 'ml', 'piece', 'pieces'];
    const initialValue = {
        categoryId: '',
        productName: '',
        price: '',
        quantity: '',
        unit: '',
        description: '',
    };

    async function loadCategories() {
        const { data } = await fetchCategories();
        if (data) { setCategories(data); }
    }

    async function loadImageUrl() {
        const { data } = await getPresignedImageUrl();
        if (data) { setImageUrl(data); }
    }

    useEffect(() => {
        setIsLoading(true);
        try {
            loadImageUrl();
            loadCategories();
        } catch (err) {
            setIsError(true)
        } finally { setIsLoading(false); }
    }, []);

    if (isLoading) {
        return <h1>Loading ...</h1>
    } if (isError) {
        return <h1>Error</h1>
    }
    return (
        <Formik
            validationSchema={addProductValidators}
            initialValues={initialValue}
            onSubmit={async (values) => {

                try {
                    await uploadImageToS3(imageUrl.uploadUrl,previewImage)
                    await saveProduct(values.categoryId, values.productName, values.price, values.quantity, values.unit, imageUrl.downloadUrl, values.description);
                } catch (err) { }
                finally { }

            }}>
            {formik => (
                <form onSubmit={formik.handleSubmit}>
                    {previewImage ? <img src={URL.createObjectURL(previewImage)} style={{ height: 30, width: 30 }} /> : <ProductImage setPreviewImage={setPreviewImage}/>}
                    <label htmlFor="productName">Product Name</label>
                    <input
                        id="productName"
                        type="text"
                        {...formik.getFieldProps('productName')}
                    />
                    {formik.touched.productName && formik.errors.productName ? (
                        <div>{formik.errors.productName}</div>
                    ) : null}


                    <label htmlFor="categoryId">Category</label>
                    <select
                        id="categoryId"
                        type="text"
                        {...formik.getFieldProps('categoryId')}>
                        {[<option key={'_noSelectedCategory'} value={''}>Select</option>, ...categories.map(_cat => <option key={_cat.id} value={_cat.id}>{_cat.name}</option>)]}
                    </select>
                    {formik.touched.categoryId && formik.errors.categoryId ? (
                        <div>{formik.errors.categoryId}</div>
                    ) : null}


                    <label htmlFor="price">Price</label>
                    <input
                        id="price"
                        type="text"
                        {...formik.getFieldProps('price')}
                    />
                    {formik.touched.price && formik.errors.price ? (
                        <div>{formik.errors.price}</div>
                    ) : null}


                    <label htmlFor="quantity">Quantity</label>
                    <input
                        id="quantity"
                        type="text"
                        {...formik.getFieldProps('quantity')}
                    />
                    {formik.touched.quantity && formik.errors.quantity ? (
                        <div>{formik.errors.quantity}</div>
                    ) : null}


                    <label htmlFor="unit">Unit</label>
                    <select
                        id="unit"
                        type="text"
                        {...formik.getFieldProps('unit')}>
                        {[<option key={"_noSelectedUnit"} value={''}>Select</option>, ...units.map(_unit => <option key={_unit} value={_unit}>{_unit}</option>)]}
                    </select>
                    {formik.touched.unit && formik.errors.unit ? (
                        <div>{formik.errors.unit}</div>
                    ) : null}


                    <label htmlFor="description">Description</label>
                    <input
                        id="description"
                        type="text"
                        {...formik.getFieldProps('description')}
                    />
                    {formik.touched.description && formik.errors.description ? (
                        <div>{formik.errors.description}</div>
                    ) : null}

                    <button type="submit">Add Product</button>
                </form>
            )}
        </Formik>
    );
}

