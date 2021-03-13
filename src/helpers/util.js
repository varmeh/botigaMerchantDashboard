import { uploadProductImage } from "../services/product-service";
import { uploadBanner, updateBanners } from "../services/profile-service";

export function capitalize(s) {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function isBackDatedDate(_date) {
  const givenDate = new Date(_date);
  const currentDate = new Date();
  if (currentDate > givenDate) {
    return true;
  }
  return false;
}

export function convertTo_YYYY_MM_DD(date) {
  if (typeof date !== "string") {
    return date.toISOString().split('T')[0];
  }
  return date.split('T')[0];
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


// utilities related to delivery

export const isOpen = (status) => status === 'open';
export const isDelayed = (status) => status === 'delayed';
export const isOutForDelivery = (status) => status === 'out';
export const isDelivered = (status) => status === 'delivered';
export const isCancelled = (status) => status === 'cancelled';

export const isCompleted = (status) => isDelivered(status) || isCancelled(status);

export function statusMessage(status) {
  if (isOpen(status)) {
    return 'Open';
  } else if (isOutForDelivery(status)) {
    return 'Out for delivery';
  } else if (isDelivered(status)) {
    return 'Delivered';
  } else if (isDelayed(status)) {
    return 'Delayed';
  } else if (isCancelled(status)) {
    return 'Cancelled';
  } else {
    return status;
  }
}

export function statusColor(status) {
  if (isOpen(status) || isDelayed(status)) {
    return 'order-open-delayed';
  } else if (isCancelled(status)) {
    return 'order-cancelled';
  } else {
    return 'order-default';
  }
}