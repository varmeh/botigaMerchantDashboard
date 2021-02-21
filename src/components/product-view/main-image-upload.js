import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone'
import AddIcon from '@material-ui/icons/Add';
import 'react-image-crop/dist/ReactCrop.css';
import { getResizedFile } from "../../helpers/util";

export function MainImageUploadComponent({ setMainImage }) {

    const onDrop = useCallback(async (acceptedFiles) => {
        getResizedFile(acceptedFiles.shift(), setMainImage, true);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop, noDrag: true, accept: 'image/jpeg, image/png', maxFiles: 1 })

    return (
        <div className="main-upload-image">
            <input {...getInputProps()} />
            <button className="add-main-image-btn" {...getRootProps()}><AddIcon /></button>
            <div className="main-description">MAIN IMAGE</div>
        </div>
    );
}