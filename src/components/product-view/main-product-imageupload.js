// import React, { useCallback, useState } from 'react';
// import { useDropzone } from 'react-dropzone'
// import AddIcon from '@material-ui/icons/Add';
// import { ProductCropper } from "./product-cropper";
// import 'react-image-crop/dist/ReactCrop.css';

// export function MainProductImageUploadComponent({ setFinalImage }) {
//     const [upImage, setUpImage] = useState(null);

//     const onDrop = useCallback(acceptedFiles => {
//         setUpImage(acceptedFiles.shift());
//     }, []);

//     const { getRootProps, getInputProps } = useDropzone({ onDrop })

//     return !upImage
//         ? <div className="main-upload-image" {...getRootProps()}>
//             <input {...getInputProps()} />
//             <button className="add-main-image-btn"><AddIcon /></button>
//             <div className="main-description">MAIN IMAGE</div>
//         </div>
//         : <ProductCropper
//             setFinalImage={setFinalImage}
//             imgSrc={URL.createObjectURL(upImage)}
//             setUpImage={setUpImage} />;
// }


import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone'
import AddIcon from '@material-ui/icons/Add';
import 'react-image-crop/dist/ReactCrop.css';

export function MainProductImageUploadComponent({ setMainImage }) {

    const onDrop = useCallback(async (acceptedFiles) => {
        getResizedFile(acceptedFiles.shift(), "product-image");
    }, []);

    function getResizedFile(file, fileName) {
        if (!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (event) {
            const imgElement = document.createElement("img");
            imgElement.src = event.target.result;
            imgElement.onload = function (e) {
                const canvas = document.createElement("canvas");
                canvas.width = 600;
                canvas.height = 600;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);
                const srcEncoded = ctx.canvas.toDataURL(e.target, "image/jpeg");
                canvas.toBlob(blob => {
                    blob.name = fileName;
                    setMainImage(blob);
                }, 'image/jpeg', 1);
            };
        };
    }

    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    return (<div className="main-upload-image" {...getRootProps()}>
        <input {...getInputProps()} />
        <button className="add-main-image-btn"><AddIcon /></button>
        <div className="main-description">MAIN IMAGE</div>
    </div>);
}