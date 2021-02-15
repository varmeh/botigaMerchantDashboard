import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { capitalize } from "../../helpers/util";

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

function AddProductForm() {
    const [showDesc, setShowDesc] = useState(false);
    return (
        <div className="product-details-body">
            <ProductImageUploadComponent />
            <div className="product-details-row">
                <TextField id="productName" label="Product Name" variant="outlined" fullWidth />
            </div>
            <div className="product-details-row">
                <TextField id="actualPrice" label="Actual Price" variant="outlined" fullWidth />
                <div className="product-details-spacer" />
                <TextField id="sellingPrice" label="Selling Price" variant="outlined" fullWidth />
            </div>
            <div className="product-details-row">
                <TextField className="product-details-small-input" id="quantity" label="Quantity" variant="outlined" />
                <div className="product-details-spacer" />
                <TextField className="product-details-small-input" id="unit" select label="Select" variant="outlined">
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
    );
}

export default function ProductDetails({ product, addProducMode, setAddProductMode }) {
    return <div className="product-details-style">
        <ProductDetailsHeader />
        {
            addProducMode
                ? <AddProductForm />
                : <ProductDetailsBody
                    product={product}
                    setAddProductMode={setAddProductMode} />
        }
    </div>
}