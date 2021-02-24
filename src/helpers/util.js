import { uploadProductImage } from "../services/product-service";

export function capitalize(s) {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}


export async function getResizedFile(file, cbFunction, isMainImage, setIsLoading) {
  if (!file) { return; }
  try {
    if (typeof setIsLoading === 'function') {
      setIsLoading(true);
    }
    const { data } = await uploadProductImage(file, isMainImage);
    if (typeof cbFunction === "function") {
      if (isMainImage) {
        cbFunction(data);
      } else {
        const { imageUrl } = data;
        cbFunction(imageUrl);
      }
    }
  } catch (err) {
    console.log(err);
  }
  finally {
    if (typeof setIsLoading === 'function') {
      setIsLoading(false);
    }
  }
}