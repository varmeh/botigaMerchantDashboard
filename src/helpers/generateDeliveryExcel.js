import moment from "moment";
import Excel from "exceljs/dist/es5/exceljs.browser.js";
import { saveAs } from "file-saver";
import { convertToCalendarFormatDate } from "./util";

const formatColumn = ({ columns, worksheet }) => {
  columns.forEach((v) => {
    for (var i = 1; i <= worksheet.rowCount; i++) {
      worksheet.getCell(`${v}${i}`).alignment =
        i === 1
          ? { vertical: "middle", horizontal: "center" }
          : { vertical: "middle", wrapText: true };

      if (i === 1) {
        worksheet.getCell(`${v}1`).font = { size: 12 };
      }
    }
  });
  worksheet.views = [{ state: "frozen", xSplit: 0, ySplit: 1 }];
};

const formatDeliveryWorksheet = ({ worksheet, isAggregateTab = false }) => {
  const columns = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    ...(isAggregateTab ? ["M"] : []),
  ];
  formatColumn({ columns, worksheet });
};

const aptAbbrevation = (apartmentName) => {
  const arr = apartmentName.split(/\s+/);
  let newName = "";
  arr.forEach((word) => {
    newName += word.charAt(0);
  });

  return newName;
};

const getWorkSheet = ({ workbook, worksheetName, isAggregateTab = false }) => {
  const worksheet = workbook.addWorksheet(worksheetName);
  const commonColumn = [
    { header: "Name", key: "name", width: 18 },
    { header: "House", key: "house", width: 18 },
    { header: "Phone", key: "phone", width: 18 },
    { header: "Order Number", key: "orderNumber", width: 18 },
    { header: "Amount", key: "amount", width: 18 },
    { header: "Order Status", key: "orderedStatus", width: 18 },
    { header: "Payment Status", key: "paymentStatus", width: 18 },
    { header: "Refund Status", key: "refundStatus", width: 18 },
    { header: "Order Date", key: "orderDate", width: 18 },
    { header: "Products", key: "products", width: 18 },
    { header: "Unit", key: "unit", width: 18 },
    { header: "Quantity", key: "quantity", width: 18 },
  ];
  worksheet.columns = isAggregateTab
    ? [
        { header: "Apartment Name", key: "apartmentName", width: 30 },
        ...commonColumn,
      ]
    : commonColumn;
  return worksheet;
};

const getEmptyRowValue = ({ isAggregateTab = false }) => ({
  ...(isAggregateTab ? { apartmentName: "" } : {}),
  name: "",
  house: "",
  phone: "",
  orderNumber: "",
  products: "",
  unit: "",
  quantity: "",
  orderedStatus: "",
  amount: "",
  paymentStatus: "",
  refundStatus: "",
  orderDate: "",
});

const generateDeliveryRow = ({
  isAggregateTab = false,
  apartmentName = "",
  deliveries,
  worksheet,
}) => {
  deliveries.forEach((delivery, index) => {
    const {
      buyer: { name, house = "", phone },
      createdAt,
      order: { status, totalAmount, products = [], number },
      payment,
      refund = {},
    } = delivery;

    products.forEach((product, index) => {
      const { name: productName, unitInfo, quantity } = product;
      if (index === 0) {
        worksheet.addRow({
          ...(isAggregateTab ? { apartmentName: apartmentName } : {}),
          name,
          house,
          phone,
          orderNumber: number,
          products: productName,
          unit: unitInfo,
          quantity: quantity,
          orderedStatus: status,
          amount: `${totalAmount}`,
          paymentStatus: payment.status,
          refundStatus: refund.status,
          orderDate: moment(createdAt).format("MMM Do, hh:mm a"),
        });
      } else {
        worksheet.addRow({
          products: productName,
          unit: unitInfo,
          quantity: quantity,
        });
      }
    });
    if (index !== deliveries.length - 1) {
      worksheet.addRow(getEmptyRowValue({ isAggregateTab }));
    }
  });
};

const generateSheetForApartment = ({ workbook, apartmentData }) => {
  const { apartment: { apartmentName } = {}, deliveries = [] } = apartmentData;

  const worksheetName =
    apartmentName.length > 30 ? aptAbbrevation(apartmentName) : apartmentName;

  const worksheet = getWorkSheet({
    workbook,
    worksheetName,
  });

  generateDeliveryRow({
    deliveries,
    worksheet,
  });
  formatDeliveryWorksheet({ worksheet });
};

const generateAggregateExcelTab = ({ workbook, deliveryData }) => {
  const worksheet = getWorkSheet({
    workbook,
    worksheetName: "All",
    isAggregateTab: true,
  });

  deliveryData.forEach((_aptData, index) => {
    const { apartment: { apartmentName } = {}, deliveries = [] } = _aptData;
    if (index !== 0) {
      worksheet.addRow(getEmptyRowValue({ isAggregateTab: true }));
    }

    generateDeliveryRow({
      isAggregateTab: true,
      apartmentName,
      deliveries,
      worksheet,
    });

    if (index !== deliveryData.length - 1) {
      worksheet.addRow(getEmptyRowValue({ isAggregateTab: true }));
      worksheet.addRow(getEmptyRowValue({ isAggregateTab: true })).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D3D3D3" },
      };
    }
  });
  formatDeliveryWorksheet({ worksheet, isAggregateTab: true });
};

export const getProductBreakupRows = ({ deliveryData = [] }) => {
  const prodcutBreakUpMap = {};
  deliveryData.forEach((_data) => {
    const { deliveries } = _data;
    deliveries.forEach((_delivery) => {
      const {
        order: { products },
      } = _delivery;
      products.forEach((_product) => {
        const { name, quantity, unitInfo } = _product;
        const key = `${name}${unitInfo}`
          .toLowerCase()
          .replace(/[^A-Z0-9]/gi, "");
        if (prodcutBreakUpMap[key]) {
          const temp = {
            ...prodcutBreakUpMap[key],
            quantity: prodcutBreakUpMap[key].quantity + quantity,
          };
          prodcutBreakUpMap[key] = temp;
        } else {
          prodcutBreakUpMap[key] = { name, unitInfo, quantity };
        }
      });
    });
  });

  const rows = Object.values(prodcutBreakUpMap);
  rows.sort(function (a, b) {
    return b.quantity - a.quantity;
  });
  return rows;
};

const generateProductBreakUpExcel = ({ workbook, deliveryData }) => {
  const rows = getProductBreakupRows({ deliveryData });
  if (rows.length > 0) {
    const worksheet = workbook.addWorksheet("Product Breakup");
    worksheet.columns = [
      { header: "Product Name", key: "name", width: 18 },
      { header: "Unit Info", key: "unitInfo", width: 18 },
      { header: "Quantity", key: "quantity", width: 18 },
    ];
    rows.forEach(({ name, unitInfo, quantity }) => {
      worksheet.addRow({ name, unitInfo, quantity });
    });

    const columns = ["A", "B", "C"];
    formatColumn({ columns, worksheet });
  }
};

export const generateExcel = async ({ deliveryData, fileName }) => {
  const workbook = new Excel.Workbook();
  workbook.creator = "Botiga";
  workbook.created = new Date();
  workbook.properties.date1904 = true;

  const generateApartmentWiseData = false;
  const generateAggregateTab = true;
  const generateProductBreakUp = true;

  //TO generate aggregate table
  if (generateAggregateTab) {
    generateAggregateExcelTab({ workbook, deliveryData });
  }
  //To generate productBreakup excel tab
  if (generateProductBreakUp) {
    generateProductBreakUpExcel({ workbook, deliveryData });
  }
  //TO generate apartment wise table
  if (generateApartmentWiseData) {
    deliveryData.forEach((apartmentData) =>
      generateSheetForApartment({
        workbook,
        apartmentData,
      })
    );
  }

  const buf = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buf]), `${fileName}.xlsx`);
};

export async function generateDeliveryExcel(
  aggregateDelivery,
  setError,
  brandName,
  selectedDeliverydate
) {
  try {
    const nonEmptyDelivery = aggregateDelivery.filter(
      (_delivery) => _delivery.count > 0
    );
    const fileName = `${brandName} ${convertToCalendarFormatDate(
      selectedDeliverydate
    )}`;
    await generateExcel({ deliveryData: nonEmptyDelivery, fileName: fileName });
  } catch (err) {
    setError(true, err);
  }
}
