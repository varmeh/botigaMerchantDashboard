import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import { deleteProductImage } from "../../services/product-service";

import { Image } from "../common/Image/Image";

export function PreviewMainImage({ mainImage, setMainImage, setIsLoading }) {
    async function removeImage() {
        try {
            setIsLoading(true);
            await deleteProductImage(mainImage.imageUrl);
            await deleteProductImage(mainImage.imageUrlSmall);
            resetMainImage();
        } catch (err) {

        }
        finally {
            setIsLoading(false);
        }
    }

    function resetMainImage() {
        setMainImage(null);
    }

    return (
        <div className="main-preview-container">
            <Image src={mainImage.imageUrl} className="main-preview-img" alt="product-image" onError={resetMainImage} />
            <CloseIcon className="main-preview-close" onClick={removeImage} />
        </div>
    );
}