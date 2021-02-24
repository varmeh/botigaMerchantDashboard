import React, { useState } from "react";

export function Image({ src, alt, className, onError }) {
    const [showImage, setShowImage] = useState(true);

    function handleError() {
        if (typeof onError === "function") {
            onError();
        } else {
            setShowImage(false);
        }
    }

    return (showImage && src)
        ? <img className={className} src={src} alt={alt} onError={handleError} />
        : null;
}
