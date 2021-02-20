import React from "react";
import CloseIcon from '@material-ui/icons/Close';

export function PreviewMainImage({ imageUrl, setMainImage }) {
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