import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone'
import AddIcon from '@material-ui/icons/Add';
import 'react-image-crop/dist/ReactCrop.css';
import { getResizedFile } from "../../helpers/util";

export function MainImageUploadComponent({ setMainImage, setIsLoading, setError }) {

    const onDrop = useCallback(async (acceptedFiles) => {
        getResizedFile(acceptedFiles.shift(), setMainImage, true, setIsLoading, setError);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop, noDrag: true, accept: 'image/jpeg, image/png', maxFiles: 1, multiple: false })

    return (
        <div className="main-upload-image" {...getRootProps()}>
            <input {...getInputProps()} />
            <div className="add-main-image-btn"><AddIcon /></div>
            <div className="main-description">MAIN IMAGE</div>
        </div>
    );
}