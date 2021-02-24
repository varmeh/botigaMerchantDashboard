import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import { deleteProductImage } from "../../services/product-service";

export function PreviewMainImage({ mainImage, setMainImage, setIsLoading }) {
    async function removeImage() {
        try {
            setIsLoading(true);
            await deleteProductImage(mainImage.imageUrl);
            await deleteProductImage(mainImage.imageUrlSmall);
            setMainImage(null);
        } catch (err) {

        }
        finally {
            setIsLoading(false);
        }

    }
    return (
        <div className="main-preview-container">
            <img src={mainImage.imageUrl} className="main-preview-img" alt="product-image" />
            <CloseIcon className="main-preview-close" onClick={removeImage} />
        </div>
    );
}