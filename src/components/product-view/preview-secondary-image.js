import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import { deleteProductImage } from "../../services/product-service";

export function PreviewSecondaryImage({ imageUrl, removeImageAtIndex, index, setIsLoading }) {
    async function removeImage() {
        try {
            setIsLoading(true);
            await deleteProductImage(imageUrl);
            removeImageAtIndex(index);
        } catch (err) {

        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="secondary-preview-container">
            <img src={imageUrl} className="secondary-preview-img" alt="secondary-product-image" />
            <CloseIcon className="secondary-preview-close" onClick={removeImage} />
        </div>
    );
}