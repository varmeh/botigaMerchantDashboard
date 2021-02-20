import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { useDropzone } from 'react-dropzone'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from "@material-ui/core/Switch";
import Image from '@material-ui/icons/Image';
import DeleteOutlineSharp from '@material-ui/icons/DeleteOutlineSharp';
import Button from '@material-ui/core/Button';
import FormControlLabel from "@material-ui/core/FormControlLabel";

import Dialog from '@material-ui/core/Dialog';
import ReactCrop from 'react-image-crop';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import 'react-image-crop/dist/ReactCrop.css';
import { saveProduct } from "../../services/product-service";

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { addProductValidators } from "../../helpers/validators";
import { capitalize } from "../../helpers/util";

import { getPresignedImageUrl, uploadImageToS3 } from "../../services/common-service";

import "./product-details.css";

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

const units = ['kg', 'gms', 'lt', 'ml', 'piece', 'pieces'];

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
    console.log(image);
    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height,
    );

    // As Base64 string
    // const base64Image = canvas.toDataURL('image/jpeg');

    // As a blob
    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            blob.name = fileName;
            resolve(blob);
        }, 'image/jpeg', 1);
    });
}

function ScrollDialog({ imgSrc, setPreviewImage, imageFile, SetFinalImage }) {
    const [scroll, setScroll] = React.useState('paper');
    const [open, setOpen] = React.useState(true);
    const [crop, setCrop] = useState({ aspect: 16 / 9 });
    const imgRef = useRef(null);

    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);

    const handleClose = async () => {
        setOpen(false);
        setPreviewImage(null);
        const croppedImg = await getCroppedImg(imgRef.current, crop, "mi");
        // SetFinalImage(window.URL.createObjectURL(croppedImg));

        var file = new File([croppedImg], "abc.png", { type: "image/png" });

        SetFinalImage(croppedImg);
    };


    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    };



    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    return (
        <div>
            <Button onClick={handleClickOpen('paper')}>scroll=paper</Button>
            <Button onClick={handleClickOpen('body')}>scroll=body</Button>
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                maxWidth={'md'}
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Subscribe</DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>

                    <ReactCrop onImageLoaded={onLoad} src={imgSrc} crop={crop} onChange={newCrop => {
                        console.log(newCrop);
                        setCrop(newCrop);
                    }} />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
            </Button>
                    <Button onClick={handleClose} color="primary">
                        Subscribe
            </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

function CropperModal({ imgSrc, setPreviewImage, imageFile, SetFinalImage }) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [crop, setCrop] = useState({ aspect: 16 / 9 });
    const imgRef = useRef(null);

    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);

    const handleClose = async () => {
        setOpen(false);
        setPreviewImage(null);
        const croppedImg = await getCroppedImg(imgRef.current, crop, "mi");
        // SetFinalImage(window.URL.createObjectURL(croppedImg));

        var file = new File([croppedImg], "abc.png", { type: "image/png" });

        SetFinalImage(croppedImg);
    };

    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Crop Image
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleClose}>
                        Done
                    </Button>
                </Toolbar>
            </AppBar>
            <ReactCrop onImageLoaded={onLoad} src={imgSrc} crop={crop} onChange={newCrop => {
                console.log(newCrop);
                setCrop(newCrop);
            }} />;
        </Dialog>
    );
}

function ProductDetailsHeader() {
    return (
        <div className="product-details-header-item">
            <div className="product-details-header-name">Product details</div>

        </div>
    );
}

function ProductImageUploadComponent({ setPreviewImage }) {
    const onDrop = useCallback(acceptedFiles => {

        setPreviewImage(acceptedFiles.shift());
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
    const [finalImage, SetFinalImage] = useState(null);

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
                        {previewImage ? <ScrollDialog SetFinalImage={SetFinalImage} imgSrc={URL.createObjectURL(previewImage)} imageFile={previewImage} setPreviewImage={setPreviewImage} /> : <ProductImageUploadComponent setPreviewImage={setPreviewImage} />}
                        {finalImage && <img src={finalImage} />}
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
                            <Button type="submit" variant="contained" color="primary" disableElevation>Save Changes</Button>
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