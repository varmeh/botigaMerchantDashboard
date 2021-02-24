import React, { useState } from "react";

export function Image({ src, alt, className }) {
    const [showImage, setShowImage] = useState(true);

    function hideImage() {
        setShowImage(false);
    }

    return (showImage && src)
        ? <img className={className} src={src} alt={alt} onError={hideImage} />
        : null;
}
