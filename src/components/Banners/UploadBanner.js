import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { getResizedBanner } from "../../helpers/util";
import 'react-image-crop/dist/ReactCrop.css';


export function UploadBannerComponent({ setError, setIsLoading, setBannerAtIndex, banners, index }) {
    const onDrop = useCallback(acceptedFiles => {
        acceptedFiles.forEach(file => {
            getResizedBanner(file, _setBannerAtIndex, setIsLoading, setError, banners)
        });
    }, [banners]);

    function _setBannerAtIndex(banner) {
        setBannerAtIndex(banner, index);
    }

    const dropzoneConfig = { onDrop, accept: 'image/jpeg, image/png', maxFiles: 1, multiple: true };

    const { getRootProps, getInputProps } = useDropzone(dropzoneConfig)

    return (
        <div className="banner-upload-image" {...getRootProps()}>
            <input {...getInputProps()} />
            <div className="add-image-btn">
                Upload Banner
            </div>
            <div className="description">or drag and drop files</div>
        </div>
    );
}