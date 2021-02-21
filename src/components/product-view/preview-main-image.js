import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import { deleteProductImage } from "../../services/product-service";

export function PreviewMainImage({ mainImage, setMainImage }) {
    async function removeImage() {
        try {
            await deleteProductImage(mainImage.imageUrl);
            await deleteProductImage(mainImage.imageUrlSmall);
            setMainImage(null);
        } catch (err) {

        }

    }
    return (
        <div className="main-preview-container">
            <img src={mainImage.imageUrl} className="main-preview-img" alt="product-image" />
            <CloseIcon className="main-preview-close" onClick={removeImage} />
        </div>
    );
}