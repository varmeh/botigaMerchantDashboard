import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import { deleteProductImage } from "../../services/product-service";

import { Image } from "../common/Image/Image";

export function PreviewSecondaryImage({ imageUrl, removeImageAtIndex, index, setIsLoading }) {
    async function removeImage() {
        try {
            setIsLoading(true);
            await deleteProductImage(imageUrl);
            resetSecondaryImageAtPoisition(index)();
        } catch (err) {

        } finally {
            setIsLoading(false);
        }
    }

    function resetSecondaryImageAtPoisition(index) {
        return function () {
            removeImageAtIndex(index);
        }
    }

    return (
        <div className="secondary-preview-container">
            <Image src={imageUrl} className="secondary-preview-img" alt="secondary-product-image" onError={resetSecondaryImageAtPoisition(index)} />
            <CloseIcon className="secondary-preview-close" onClick={removeImage} />
        </div>
    );
}