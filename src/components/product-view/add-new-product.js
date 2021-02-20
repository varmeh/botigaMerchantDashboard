import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from "@material-ui/core/Switch";
import DeleteOutlineSharp from '@material-ui/icons/DeleteOutlineSharp';
import Button from '@material-ui/core/Button';
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { ProductImageUploadComponent } from "./product-image-upload";
import { MainProductImageUploadComponent } from "./main-product-imageupload";
import { saveProduct } from "../../services/product-service";
import { addProductValidators } from "../../helpers/validators";
import { PreviewImage } from "./preview-image";
import { capitalize } from "../../helpers/util";
import { getPresignedImageUrl, uploadImageToS3 } from "../../services/common-service";

import 'react-image-crop/dist/ReactCrop.css';

const units = ['kg', 'gms', 'lt', 'ml', 'piece', 'pieces'];

export function AddNewProduct({ categories }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [showDesc, setShowDesc] = useState(false);
    const [imageUrl, setImageUrl] = useState({ uploadUrl: '', downloadUrl: '' });
    const [finalImage, setFinalImage] = useState(null);

    const initialValue = {
        category: '',
        productName: '',
        price: '',
        quantity: '',
        unit: '',
        description: '',
    };

    async function loadPresignedImageUrl() {
        const { data } = await getPresignedImageUrl();
        if (data) { setImageUrl(data); }
    }

    useEffect(() => {
        try {
            setIsLoading(true);
            loadPresignedImageUrl();
        } catch (err) {
            setIsError(true);
        }
        finally {
            setIsLoading(false);
        }
    }, []);


    return (
        <Formik
            validationSchema={addProductValidators}
            initialValues={initialValue}
            onSubmit={
                async (values) => {
                    try {
                        await uploadImageToS3(imageUrl.uploadUrl, finalImage)
                        await saveProduct(values.category, values.productName, values.price, values.quantity, values.unit, imageUrl.downloadUrl, values.description);
                    } catch (err) { }
                    finally { }
                }
            }>
            {({ handleSubmit, getFieldProps, touched, errors }) => (
                <form onSubmit={handleSubmit}>
                    <div className="product-details-body">
                        <div className="product-details-row">
                            <TextField id="productName" label="Product Name" variant="outlined" fullWidth  {...getFieldProps('productName')} error={touched.productName && errors.productName} helperText={errors.productName} />
                        </div>
                        <div className="product-details-row">
                            <TextField id="category" select label="Select category" fullWidth variant="outlined" {...getFieldProps('category')} error={touched.category && errors.category} helperText={errors.category}>
                                {categories.map((value) => (
                                    <MenuItem key={value.categoryId} value={value.categoryId}>
                                        <span className="menu-item-unit">{capitalize(value.name)}</span>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <div className="product-details-row">
                            <TextField id="actualPrice" label="Actual Price" variant="outlined" fullWidth {...getFieldProps('price')} error={touched.price && errors.price} helperText={errors.price} />
                            <div className="product-details-spacer" />
                            <TextField id="price" label="Selling Price" variant="outlined" fullWidth {...getFieldProps('price')} error={touched.price && errors.price} helperText={errors.price} />
                        </div>
                        <div className="product-details-row">
                            <TextField className="product-details-small-input" id="quantity" label="Quantity" variant="outlined" {...getFieldProps('quantity')} error={touched.quantity && errors.quantity} helperText={errors.quantity} />
                            <div className="product-details-spacer" />
                            <TextField className="product-details-small-input" id="unit" select label="Select" variant="outlined" {...getFieldProps('unit')} error={touched.unit && errors.unit} helperText={errors.unit}>
                                {units.map((value) => (
                                    <MenuItem key={value} value={value}>
                                        <span className="menu-item-unit">{capitalize(value)}</span>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <div className="product-details-row">
                            {finalImage ? <PreviewImage imageUrl={URL.createObjectURL(finalImage)} setFinalImage={setFinalImage} /> : <MainProductImageUploadComponent setFinalImage={setFinalImage} />}
                            <div className="product-details-spacer" />
                            {finalImage ? <PreviewImage imageUrl={URL.createObjectURL(finalImage)} setFinalImage={setFinalImage} /> : <ProductImageUploadComponent setFinalImage={setFinalImage} />}
                        </div>
                        <div className="product-details-row">
                            <div className="image_info_banner">
                                <div className="block_section">
                                    <div className="primary">format</div>
                                    <div className="secondary">JPG, PNG</div>
                                </div>
                                <div className="block_section">
                                    <div className="primary">dimension</div>
                                    <div className="secondary"> 600 px x 600 px</div>
                                </div>
                                <div className="block_section">
                                    <div className="primary">size</div>
                                    <div className="secondary">20 MB Max.</div>
                                </div>
                            </div>
                        </div>
                        <div className="product-details-row">
                            <FormControlLabel
                                className="product-details-description-text"
                                value="Add Description"
                                control={<Switch color="primary" />}
                                label="Add Description"
                                labelPlacement="start"
                                checked={showDesc}
                                onChange={() => setShowDesc(!showDesc)}
                            />
                        </div>
                        {showDesc
                            ? <div className="product-details-row">
                                <TextField
                                    {...getFieldProps('description')}
                                    id="description"
                                    label="Product Description"
                                    multiline
                                    fullWidth
                                    rows={3}
                                    variant="outlined" />
                            </div>
                            : null}
                    </div>
                    <div className="product-details-row-action">
                        <Button startIcon={<DeleteOutlineSharp />}>Delete Product</Button>
                        <div className="product-details-row-action-btns">
                            <Button>Cancel</Button>
                            <div className="product-details-spacer" />
                            <Button type="submit" variant="contained" color="primary" disableElevation>Save Changes</Button>
                        </div>
                    </div>
                </form>
            )}
        </Formik>
    );
}