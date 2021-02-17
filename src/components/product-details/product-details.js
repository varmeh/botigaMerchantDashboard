import React, { useCallback, useState, useEffect } from 'react';
import { Formik } from 'formik';
import { useDropzone } from 'react-dropzone'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from "@material-ui/core/Switch";
import Image from '@material-ui/icons/Image';
import DeleteOutlineSharp from '@material-ui/icons/DeleteOutlineSharp';
import Button from '@material-ui/core/Button';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { addProductValidators } from "../../helpers/validators";
import { capitalize } from "../../helpers/util";

import { getPresignedImageUrl } from "../../services/common-service";

import "./product-details.css";


const units = ['kg', 'gms', 'lt', 'ml', 'piece', 'pieces'];

function ProductDetailsHeader() {
    return (
        <div className="product-details-header-item">
            <div className="product-details-header-name">Product details</div>

        </div>
    );
}

function ProductImageUploadComponent(props) {
    const onDrop = useCallback(acceptedFiles => {
        props.setPreviewImage(acceptedFiles.shift());
    }, [])
    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    return (
        <div className="upload-image" {...getRootProps()}>
            <input {...getInputProps()} />
            <button className="add-image-btn">
                <Image />Add Image</button>
            <div className="description">Adding image will increase people interest in your product</div>
        </div>
    );
}

function ProductDetailsBody({ product }) {
    const [showDesc, setShowDesc] = useState(false);
    const [quantity, unit] = product ? product.size.split(" ") : "";
    return (
        <div className="product-details-body">
            {
                product != null ?
                    <React.Fragment>
                        <ProductImageUploadComponent />
                        <div className="product-details-row">
                            <TextField value={product.name} id="productName" label="Product Name" variant="outlined" fullWidth />
                        </div>
                        <div className="product-details-row">
                            <TextField id="actualPrice" value={product.price} label="Actual Price" variant="outlined" fullWidth />
                            <div className="product-details-spacer" />
                            <TextField id="sellingPrice" value={product.price} label="Selling Price" variant="outlined" fullWidth />
                        </div>
                        <div className="product-details-row">
                            <TextField className="product-details-small-input" value={quantity} id="quantity" label="Quantity" variant="outlined" />
                            <div className="product-details-spacer" />
                            <TextField value={unit} className="product-details-small-input" id="unit" select label="Select" variant="outlined">
                                {units.map((value) => (
                                    <MenuItem key={value} value={value}>
                                        <span className="menu-item-unit">{capitalize(value)}</span>
                                    </MenuItem>
                                ))}
                            </TextField>
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
                                    id="outlined-multiline-static"
                                    label="Product Description"
                                    multiline
                                    fullWidth
                                    rows={3}
                                    variant="outlined" />
                            </div>
                            : null}
                    </React.Fragment> :
                    <div className="no-product-slected">
                        No Product Selected
                    </div>
            }
        </div>
    );
}

function AddNewProduct({ categories }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [showDesc, setShowDesc] = useState(false);
    const [imageUrl, setImageUrl] = useState({ uploadUrl: '', downloadUrl: '' });
    const [previewImage, setPreviewImage] = useState(null);

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
            onSubmit={async (values) => {
            }}>
            {({ handleSubmit, getFieldProps, touched, errors }) => (
                <form onSubmit={handleSubmit}>
                    <div className="product-details-body">
                        <ProductImageUploadComponent />
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
                                    id="outlined-multiline-static"
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
                            <Button variant="contained" color="primary" disableElevation>Save Changes</Button>
                        </div>
                    </div>
                </form>
            )}
        </Formik>
    );
}

export default function ProductDetails({ product, categories, addProducMode, setAddProductMode }) {
    return <div className="product-details-style">
        <ProductDetailsHeader />
        {
            addProducMode
                ? <AddNewProduct categories={categories} />
                : <ProductDetailsBody
                    product={product}
                    setAddProductMode={setAddProductMode} />
        }
    </div>
}