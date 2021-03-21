import moment from 'moment'
import { uploadProductImage } from "../services/product-service";
import { uploadBanner, updateBanners } from "../services/profile-service";

export function capitalize(s) {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function isBackDatedDate(_date) {
  const givenDate = moment(_date);
  const currentDate = moment(new Date());
  if (currentDate.diff(givenDate) > 0) {
    return true;
  }
  return false;
}

export function convertToRequestFormatDate(date) {
  //Formats date as 2021-03-16
  return moment(date).format('YYYY-MM-DD');
}

export function convertToCalendarFormatDate(date) {
  //Formats date as  03/20/2021
  return moment(date).format('L');
}

export function convertToUiFormatLongDate(date) {
  //Formats date as March 11, 2021 12:40 PM
  return moment(date).format('LLL')
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
    return 'Order Placed';
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
  if (isDelivered(status)) {
    return 'delivered';
  } else if (isOpen(status)) {
    return 'open';
  } else if (isOutForDelivery(status)) {
    return 'out-for-delivery';
  } else if (isDelayed(status)) {
    return 'delayed';
  } else {
    // Cancelled
    return 'canelled';
  }
}



export const isRefundInitiated = (status) => status == 'initiated';
export const isRefundSuccess = (status) => status == 'success';
export const isRefundFailure = (status) => status == 'failure';
export const isRefund = (status) => status != null;
export const isRefundDue = (status) => status != null && !isRefundSuccess(status);