import React from "react";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export function PreviewImage({ imageUrl, setMainImage }) {
    function removeImage() {
        setMainImage(null);
    }
    return (
        <div className="main-preview-container">
            <img src={imageUrl} className="main-preview-img" alt="product-image" />
            <CloseIcon className="main-preview-close" onClick={removeImage} />
        </div>
    );
}