import React, { useCallback, useState, useRef } from 'react';
import Button from '@material-ui/core/Button';
import Check from '@material-ui/icons/Check';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ReactCrop from 'react-image-crop';


function getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
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

    return new Promise((resolve, _) => {
        canvas.toBlob(blob => {
            blob.name = fileName;
            resolve(blob);
        }, 'image/jpeg', 1);
    });
}


export function ProductCropper({ imgSrc, setFinalImage, setUpImage }) {
    const [open, setOpen] = useState(true);
    const [crop, setCrop] = useState({ aspect: 16 / 9 });
    const imgRef = useRef(null);

    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);

    const handleClose = async () => {
        setOpen(false);
        setUpImage(null);
        setFinalImage(null);
    };

    const handleDone = async () => {
        setOpen(false);
        const croppedImg = await getCroppedImg(imgRef.current, crop, "product-image");
        setUpImage(null);
        setFinalImage(croppedImg);
    }

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth={'lg'}
            open={open}
            scroll={'paper'}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            className="resize-image"
        >
            <DialogTitle id="scroll-dialog-title">Resize Image</DialogTitle>
            <DialogContent dividers>
                <ReactCrop onImageLoaded={onLoad} src={imgSrc} crop={crop} onChange={newCrop => {
                    setCrop(newCrop);
                }} />
            </DialogContent>
            <DialogActions className="product-details-row-action-btns">
                <Button disableElevation onClick={handleClose}>Cancel</Button>
                <Button disableElevation onClick={handleDone} variant="contained" color="primary" startIcon={<Check />}>Done</Button>
            </DialogActions>
        </Dialog>
    );
}
