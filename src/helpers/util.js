import { uploadProductImage } from "../services/product-service";
import { uploadBanner, updateBanners } from "../services/profile-service";

export function capitalize(s) {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}


export async function getResizedFile(file, cbFunction, isMainImage, setIsLoading, setError) {
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
    if (typeof setError === 'function') {
      setError(true, err);
    }
  }
  finally {
    if (typeof setIsLoading === 'function') {
      setIsLoading(false);
    }
  }
}

export async function getResizedBanner(file, cbFunction, setIsLoading, setError, banners) {
  if (!file) { return; }
  try {
    if (typeof setIsLoading === 'function') {
      setIsLoading(true);
    }
    const { data } = await uploadBanner(file);
    if (typeof cbFunction === "function") {
      const { imageUrl } = data;
      const nonEmptyBanners = [...banners, imageUrl].filter(_banner => _banner);
      await updateBanners(nonEmptyBanners);
      cbFunction(imageUrl);
    }
  } catch (err) {
    if (typeof setError === 'function') {
      setError(true, err);
    }
  }
  finally {
    if (typeof setIsLoading === 'function') {
      setIsLoading(false);
    }
  }
}