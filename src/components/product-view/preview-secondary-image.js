import React from "react";
import CloseIcon from '@material-ui/icons/Close';

export function PreviewSecondaryImage({ imageUrl, removeImageAtIndex, index }) {
    function removeImage() {
        removeImageAtIndex(index);
    }
    return (
        <div className="secondary-preview-container">
            <img src={imageUrl} className="secondary-preview-img" alt="secondary-product-image" />
            <CloseIcon className="secondary-preview-close" onClick={removeImage} />
        </div>
    );
}