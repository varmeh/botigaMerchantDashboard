import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import AddIcon from '@material-ui/icons/Add';
import 'react-image-crop/dist/ReactCrop.css';
import { getResizedFile } from "../../helpers/util";


export function SecondaryImageUploadComponent({ addOtherImages, isSmall }) {

    const onDrop = useCallback(acceptedFiles => {
        acceptedFiles.forEach(file => {
            getResizedFile(file, addOtherImages, false);
        });
    }, []);

    const dropzoneConfig = (isSmall
        ? { onDrop, noDrag: true, accept: 'image/jpeg, image/png', maxFiles: 1, multiple: false }
        : { onDrop, accept: 'image/jpeg, image/png', maxFiles: 4, multiple: true });

    const { getRootProps, getInputProps } = useDropzone(dropzoneConfig)

    function getSmallUplaod() {
        return (
            <div className="secondary-small-upload-image" {...getRootProps()} >
                <input {...getInputProps()} />
                <AddIcon />
                <div className="add-secondary-description">Add</div>
            </div>
        );
    }

    function getLargeUpload() {
        return (
            <div className="upload-image" {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="add-image-btn">
                    Add more images
                </div>
                <div className="description">or drag and drop files</div>
            </div>
        );
    }

    return isSmall ? getSmallUplaod() : getLargeUpload();
}