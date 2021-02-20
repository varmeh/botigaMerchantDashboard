import React from "react";
import Button from '@material-ui/core/Button';

export function PreviewImage({ imageUrl, setFinalImage }) {
    function removeImage() {
        setFinalImage(null);
    }
    return (
        <React.Fragment>
            <img src={imageUrl} alt="product-image" />
            <button onClick={removeImage} className="preview-image-remove">Button</button>
        </React.Fragment>
    );
}