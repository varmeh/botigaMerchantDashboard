import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone'
import AddIcon from '@material-ui/icons/Add';
import { ProductCropper } from "./product-cropper";
import 'react-image-crop/dist/ReactCrop.css';

export function MainProductImageUploadComponent({ setFinalImage }) {
    const [upImage, setUpImage] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
        setUpImage(acceptedFiles.shift());
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    return !upImage
        ? <div className="main-upload-image" {...getRootProps()}>
            <input {...getInputProps()} />
            <button className="add-main-image-btn"><AddIcon /></button>
            <div className="main-description">MAIN IMAGE</div>
        </div>
        : <ProductCropper
            setFinalImage={setFinalImage}
            imgSrc={URL.createObjectURL(upImage)}
            setUpImage={setUpImage} />;
}