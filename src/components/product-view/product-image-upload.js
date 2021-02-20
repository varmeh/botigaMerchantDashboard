import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone'
import Image from '@material-ui/icons/Image';
import { ProductCropper } from "./product-cropper";
import 'react-image-crop/dist/ReactCrop.css';

export function ProductImageUploadComponent({ setFinalImage }) {
    const [upImage, setUpImage] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
        setUpImage(acceptedFiles.shift());
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    return !upImage
        ? <div className="upload-image" {...getRootProps()}>
            <input {...getInputProps()} />
            <button className="add-image-btn">
                Add more images</button>
            <div className="description">or drag and drop files</div>
        </div>
        : <ProductCropper
            setFinalImage={setFinalImage}
            imgSrc={URL.createObjectURL(upImage)}
            setUpImage={setUpImage} />;
}