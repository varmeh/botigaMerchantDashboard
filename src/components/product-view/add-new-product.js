import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import TextField from "../common/BotigatextField/botiga-textfield";
import MenuItem from "@material-ui/core/MenuItem";
import Switch from "@material-ui/core/Switch";
import DeleteOutlineSharp from "@material-ui/icons/DeleteOutlineSharp";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { SecondaryImageUploadComponent } from "./secondary-image-upload";
import { MainImageUploadComponent } from "./main-image-upload";
import {
  saveProduct,
  deleteProduct,
  updateProduct,
  updateProductRecommendation,
} from "../../services/product-service";
import {
  addProductValidators,
  MAX_CHAR_DESCRIPTION,
} from "../../helpers/validators";
import { PreviewMainImage } from "./preview-main-image";
import { PreviewSecondaryImage } from "./preview-secondary-image";
import CircularProgress from "@material-ui/core/CircularProgress";

import "react-image-crop/dist/ReactCrop.css";

const units = ["kg", "gms", "lt", "ml", "piece", "pieces"];

function isProductEmpty(product) {
  return Object.keys(product).length === 0;
}

function getMainProductImageObject(product) {
  if (isProductEmpty(product)) {
    return null;
  } else {
    return {
      imageUrl: product.imageUrlLarge,
      imageUrlSmall: product.imageUrl,
    };
  }
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export function AddNewProduct({
  selectedCategoryId,
  refresh,
  product,
  hideShowAddProductForm,
  setError,
  updateProductRecomendation,
  maxRecommendedProducts,
}) {
  const [isRecomendationAlertOpen, setRecomendationAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [quantity, unit] = (product.size || "").split(" ");
  const [recommended, setProductRecommended] = useState(false);

  const initialValue = {
    productName: product.name || "",
    mrp: product.mrp || "",
    price: product.price || "",
    quantity: quantity || "",
    unit: unit || "",
    description: (product.description || "").replace(/(\r\n|\n|\r)/gm, ""),
  };

  useEffect(() => {
    const desc = product.description ? true : false;
    setShowDesc(desc);
  }, [product.description]);

  useEffect(() => {
    const recommended =
      typeof product.recommended === "boolean" ? product.recommended : false;
    setProductRecommended(recommended);
  }, [product.recommended]);

  useEffect(() => {
    setMainImage(getMainProductImageObject(product));
  }, [product.imageUrlLarge, product.imageUrl]);

  useEffect(() => {
    setOtherImages(product.secondaryImageUrls || []);
  }, [product.secondaryImageUrls]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setRecomendationAlertOpen(false);
  };

  function addOtherImages(image) {
    setOtherImages((images) => [...images, image]);
  }

  function removeImageAtIndex(index) {
    const images = [...otherImages];
    images.splice(index, 1);
    setOtherImages(images);
  }

  async function removeProduct() {
    try {
      setIsLoading(true);
      await deleteProduct(product.id, selectedCategoryId);
      refresh();
    } catch (err) {
      setError(true, err);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateRecommmendation(recommendedStatus) {
    try {
      setProductRecommended(recommendedStatus);
      setIsLoading(true);
      await updateProductRecommendation(
        selectedCategoryId,
        product.id,
        recommendedStatus
      );
      updateProductRecomendation(
        selectedCategoryId,
        product.id,
        recommendedStatus
      );
      setRecomendationAlertOpen(true);
    } catch (err) {
      setProductRecommended(!recommendedStatus);
      setError(true, err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={isLoading ? "disable-container" : "no-css"}>
      {isLoading && (
        <div className="view-loader">
          <CircularProgress />
        </div>
      )}
      <Formik
        enableReinitialize
        validationSchema={addProductValidators}
        initialValues={initialValue}
        onSubmit={async (values) => {
          const { mrp, price } = values;
          if (mrp) {
            const mrpAsNumber = parseFloat(mrp);
            const priceAsNumber = parseFloat(price);
            if (mrpAsNumber <= priceAsNumber) {
              setError(true, "MRP should be greater than Price");
              return null;
            }
          }
          const imageurl = mainImage ? mainImage.imageUrlSmall : "";
          const imageUrlLarge = mainImage ? mainImage.imageUrl : "";
          const description = showDesc ? values.description : "";
          try {
            setIsLoading(true);
            if (isProductEmpty(product)) {
              await saveProduct(
                selectedCategoryId,
                values.productName,
                price,
                mrp,
                values.quantity,
                values.unit,
                imageurl,
                imageUrlLarge,
                description,
                otherImages
              );
            } else {
              await updateProduct(
                product.id,
                selectedCategoryId,
                values.productName,
                values.price,
                values.mrp,
                values.quantity,
                values.unit,
                imageurl,
                imageUrlLarge,
                description,
                otherImages,
                product.available
              );
            }
            refresh();
          } catch (err) {
            setError(true, err);
          } finally {
            setIsLoading(false);
          }
        }}
      >
        {({ handleSubmit, getFieldProps, touched, errors }) => (
          <form onSubmit={handleSubmit}>
            <div className="product-details-body">
              <div className="product-details-row">
                <TextField
                  id="productName"
                  label="Product Name"
                  variant="outlined"
                  fullWidth
                  {...getFieldProps("productName")}
                  error={touched.productName && errors.productName}
                  helperText={errors.productName}
                />
              </div>
              <div className="product-details-row">
                <TextField
                  id="mrp"
                  label="MRP (Optional)"
                  variant="outlined"
                  fullWidth
                  {...getFieldProps("mrp")}
                  error={touched.mrp && errors.mrp}
                  helperText={errors.mrp}
                />
                <div className="product-details-spacer" />
                <TextField
                  id="price"
                  label="Selling Price"
                  variant="outlined"
                  fullWidth
                  {...getFieldProps("price")}
                  error={touched.price && errors.price}
                  helperText={errors.price}
                />
              </div>
              <div className="product-details-row">
                <TextField
                  className="product-details-small-input"
                  id="quantity"
                  label="Quantity"
                  variant="outlined"
                  {...getFieldProps("quantity")}
                  error={touched.quantity && errors.quantity}
                  helperText={errors.quantity}
                />
                <div className="product-details-spacer" />
                <TextField
                  className="product-details-small-input"
                  id="unit"
                  select
                  label="Select"
                  variant="outlined"
                  {...getFieldProps("unit")}
                  error={touched.unit && errors.unit}
                  helperText={errors.unit}
                >
                  {units.map((value) => (
                    <MenuItem key={value} value={value}>
                      <span className="menu-item-unit">{value}</span>
                    </MenuItem>
                  ))}
                </TextField>
                {!isProductEmpty(product) && maxRecommendedProducts !== 0 ? (
                  <div className="recommended-section">
                    <div className="recommended-text">Recommended</div>
                    <FormControlLabel
                      className="product-details-description-text"
                      control={<Switch color="primary" />}
                      checked={recommended}
                      onChange={() => updateRecommmendation(!recommended)}
                    />
                  </div>
                ) : null}
              </div>
              <div className="product-details-row">
                {mainImage ? (
                  mainImage.imageUrl ? (
                    <PreviewMainImage
                      mainImage={mainImage}
                      setMainImage={setMainImage}
                      setIsLoading={setIsLoading}
                      setError={setError}
                    />
                  ) : (
                    <MainImageUploadComponent
                      setMainImage={setMainImage}
                      setIsLoading={setIsLoading}
                      setError={setError}
                    />
                  )
                ) : (
                  <MainImageUploadComponent
                    setMainImage={setMainImage}
                    setIsLoading={setIsLoading}
                    setError={setError}
                  />
                )}
                <div className="product-details-spacer" />
                <div className="secondary-container">
                  {otherImages.length > 0 ? (
                    otherImages.length === 4 ? (
                      otherImages.map((image, index) => (
                        <PreviewSecondaryImage
                          key={index}
                          imageUrl={image}
                          index={index}
                          removeImageAtIndex={removeImageAtIndex}
                          setIsLoading={setIsLoading}
                          setError={setError}
                        />
                      ))
                    ) : (
                      <React.Fragment>
                        {otherImages.map((image, index) => (
                          <PreviewSecondaryImage
                            key={index}
                            imageUrl={image}
                            index={index}
                            removeImageAtIndex={removeImageAtIndex}
                            setIsLoading={setIsLoading}
                            setError={setError}
                          />
                        ))}
                        <SecondaryImageUploadComponent
                          isSmall={true}
                          addOtherImages={addOtherImages}
                          setIsLoading={setIsLoading}
                          setError={setError}
                        />
                      </React.Fragment>
                    )
                  ) : (
                    <SecondaryImageUploadComponent
                      isSmall={false}
                      addOtherImages={addOtherImages}
                      setIsLoading={setIsLoading}
                      setError={setError}
                    />
                  )}
                </div>
              </div>
              <div className="product-details-row">
                <div className="image_info_banner">
                  <div className="block_section">
                    <div className="primary">format</div>
                    <div className="secondary">PNG | JPG | JPEG</div>
                  </div>
                  <div className="block_section">
                    <div className="primary">dimension</div>
                    <div className="secondary"> 1024 px x 1024 px</div>
                  </div>
                  <div className="block_section">
                    <div className="primary">size</div>
                    <div className="secondary">Approx. 100KB</div>
                  </div>
                </div>
              </div>
              <div className="product-details-row">
                <FormControlLabel
                  className="product-details-description-text"
                  value="Add Description"
                  control={<Switch color="primary" />}
                  label="Add Description"
                  labelPlacement="start"
                  checked={showDesc}
                  onChange={() => setShowDesc(!showDesc)}
                />
              </div>
              {showDesc ? (
                <div className="product-details-row">
                  <TextField
                    {...getFieldProps("description")}
                    id="description"
                    label="Product Description"
                    multiline
                    fullWidth
                    rows={3}
                    variant="outlined"
                    inputProps={{ maxLength: MAX_CHAR_DESCRIPTION }}
                    requiresCounterValidation={true}
                  />
                </div>
              ) : null}
            </div>
            <div className="product-details-row-action">
              <Button
                disabled={isProductEmpty(product)}
                onClick={removeProduct}
                startIcon={<DeleteOutlineSharp />}
              >
                Delete Product
              </Button>
              <div className="product-details-row-action-btns">
                <Button onClick={hideShowAddProductForm}>Cancel</Button>
                <div className="product-details-spacer" />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disableElevation
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        )}
      </Formik>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        key={"bottom right"}
        open={isRecomendationAlertOpen}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={"success"}>
          {recommended ? (
            <React.Fragment>
              <div className="success-heading">AWESOME!</div>
              <div className="success-secondary">
                Added to recommended products.
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="success-heading">REMOVED!</div>
              <div className="success-secondary">
                Removed from recommended products.
              </div>
            </React.Fragment>
          )}
        </Alert>
      </Snackbar>
    </div>
  );
}
