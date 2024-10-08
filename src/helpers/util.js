import moment from "moment";
import { uploadProductImage } from "../services/product-service";
import { uploadBanner, updateBanners } from "../services/profile-service";

export function capitalize(s) {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
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
  return moment(date).format("YYYY-MM-DD");
}

export function convertToCalendarFormatDate(date) {
  //Formats date as  APRIL 14, 2021
  return moment(date).format("LL");
}

export function convertToCalendarFormatDateForDisplay(date) {
  //Formats date as  APRIL 21
  return moment(date).format("MMMM DD");
}

export function convertToUiFormatLongDate(date) {
  //Formats date as March 11, 2021 12:40 PM
  return moment(date).format("LLL");
}

export async function getResizedFile(
  file,
  cbFunction,
  isMainImage,
  setIsLoading,
  setError
) {
  if (!file) {
    return;
  }
  try {
    if (typeof setIsLoading === "function") {
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
    if (typeof setError === "function") {
      setError(true, err);
    }
  } finally {
    if (typeof setIsLoading === "function") {
      setIsLoading(false);
    }
  }
}

export async function getResizedBanner(
  file,
  cbFunction,
  setIsLoading,
  setError,
  banners
) {
  if (!file) {
    return;
  }
  try {
    if (typeof setIsLoading === "function") {
      setIsLoading(true);
    }
    const { data } = await uploadBanner(file);
    if (typeof cbFunction === "function") {
      const { imageUrl } = data;
      const nonEmptyBanners = [...banners, imageUrl].filter(
        (_banner) => _banner
      );
      await updateBanners(nonEmptyBanners);
      cbFunction(imageUrl);
    }
  } catch (err) {
    if (typeof setError === "function") {
      setError(true, err);
    }
  } finally {
    if (typeof setIsLoading === "function") {
      setIsLoading(false);
    }
  }
}

// utilities related to delivery

export const isOpen = (status) => status === "open";
export const isDelayed = (status) => status === "delayed";
export const isOutForDelivery = (status) => status === "out";
export const isDelivered = (status) => status === "delivered";
export const isCancelled = (status) => status === "cancelled";

export const isCompleted = (status) =>
  isDelivered(status) || isCancelled(status);

export function statusMessage(status) {
  if (isOpen(status)) {
    return "Order Placed";
  } else if (isOutForDelivery(status)) {
    return "Shipped";
  } else if (isDelivered(status)) {
    return "Delivered";
  } else if (isDelayed(status)) {
    return "Delivery Date Changed";
  } else if (isCancelled(status)) {
    return "Cancelled";
  } else {
    return status;
  }
}

export function statusColor(status) {
  if (isDelivered(status)) {
    return "delivered";
  } else if (isOpen(status)) {
    return "open";
  } else if (isOutForDelivery(status)) {
    return "out-for-delivery";
  } else if (isDelayed(status)) {
    return "delayed";
  } else if (isCancelled(status)) {
    return "canelled";
  } else if (status === "all") {
    return "all";
  } else if (status === "only-open") {
    return "only-open";
  } else {
    return "default";
  }
}

export const isRefundInitiated = (status) => status === "initiated";
export const isRefundSuccess = (status) => status === "success";
export const isRefundFailure = (status) => status === "failure";
export const isRefund = (status) => status != null;
export const isRefundDue = (status) =>
  status != null && !isRefundSuccess(status);

export const isPaymentSuccess = (status) => status === "success";

export const transformedStatusFilterList = (filterStatusList) => {
  const statusList = [];
  filterStatusList.forEach((status) => {
    if (status === "all") {
      statusList.push("open");
      statusList.push("delayed");
      statusList.push("out");
      statusList.push("delivered");
      statusList.push("cancelled");
    }
    if (status === "only-open") {
      statusList.push("open");
      statusList.push("delayed");
    } else {
      statusList.push(status);
    }
  });
  return statusList;
};

export const isEqualArray = (array1, array2) =>
  JSON.stringify(array1) === JSON.stringify(array2);

export const getMaxDateRangeForDeliveryAction = (days) =>
  moment().add(days, "days");

export const getMinDateRangeToViewDelivery = (days) =>
  moment().add(days, "days");
