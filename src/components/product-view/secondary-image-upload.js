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
        ? { onDrop, noDrag: true, accept: 'image/jpeg, image/png', maxFiles: 1 }
        : { onDrop, accept: 'image/jpeg, image/png', maxFiles: 4 });

    const { getRootProps, getInputProps } = useDropzone(dropzoneConfig)

    function getSmallUplaod() {
        return (
            <div className="secondary-small-upload-image">
                <input {...getInputProps()} />
                <AddIcon {...getRootProps()} />
                <div className="add-secondary-description">Add</div>
            </div>
        );
    }

    function getLargeUpload() {
        return (
            <div className="upload-image" {...getRootProps()}>
                <input {...getInputProps()} />
                <button className="add-image-btn">
                    Add more images</button>
                <div className="description">or drag and drop files</div>
            </div>
        );
    }

    return isSmall ? getSmallUplaod() : getLargeUpload();
}