import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Image } from "../common/Image/Image";
import { updateProductStatus } from "../../services/product-service";
import { capitalize } from "../../helpers/util";

import "./product-list.css";

function getProductSizeAndPriceDetails(size, mrp, price) {
  const showMrp = mrp && mrp > price;
  return (
    <React.Fragment>
      <span className="text-light">
        {size} •{showMrp && <del>&#8377; {mrp}</del>}
      </span>
      <span className="text-dark">&nbsp;&#8377;{price}</span>
    </React.Fragment>
  );
}

function ProductHeader({ showProductAddForm, isAddProductBtnDisabled }) {
  return (
    <div className="product-header-item">
      <div className="product-header-name">Product</div>
      <Button className="product-header-btn" disabled={isAddProductBtnDisabled} onClick={showProductAddForm}>+ ADD</Button>
    </div>
  );
}

function ProductItem({ product, selectProduct, selectedProductId, selectedCategoryId, refresh, setIsLoading, setError }) {
  const { id, name, imageUrl, size, price, mrp, description, available, tag } = product;
  const [productStatus, setProductStatus] = useState(available);
  let productItemClass = "product-item";

  async function changeProductStatus() {
    let oldStatus = productStatus;
    setProductStatus(!productStatus);
    try {
      setIsLoading(true);
      await updateProductStatus(selectedCategoryId, product, !productStatus);
      await refresh();
    } catch (err) {
      setProductStatus(oldStatus);
      setError(true, err);
    }
    finally {
      setIsLoading(false);
    }
  }

  function handleItemRowClick(event) {
    const className = event.target.className || '';
    if (className.includes('MuiSwitch-input') || className.includes('MuiFormControlLabel-label')) {
      return null;
    }
    selectProduct(id)
  }

  if (id === selectedProductId) {
    productItemClass = `${productItemClass} item_selected`;
  }

  return (
    <div className={productItemClass} onClick={handleItemRowClick}>
      <div className="product-item-row-header">
        <div className="product-name">{name}</div>
        <FormControlLabel
          className="product-status-text"
          value={productStatus}
          control={<Switch color="primary" />}
          label={productStatus ? "Available" : "Not available"}
          labelPlacement="start"
          onChange={changeProductStatus}
          checked={productStatus} />
      </div>
      <div className="product-item-row-description">
        <div className="product-secondary-text">
          {getProductSizeAndPriceDetails(size, mrp, price)}
          <div className="description text-light">
            {description}
          </div>
        </div>
        {imageUrl && <ProductImage url={imageUrl} name={name} tag={tag} />}
      </div>
    </div>
  );
}

const ProductImage = React.memo(function ({ url, name, tag }) {
  return (
    <div className="product-item-image-container">
      {tag && <span className="badge">{capitalize(tag)}</span>}
      <Image className="product-item-image" src={url} alt={name} />
    </div>
  );
});

export default function ProductList({ products, selectProduct, selectedCategoryId, selectedProductId, showProductAddForm, updateScreen, isAddProductBtnDisabled, setError }) {
  const [isLoading, setIsLoading] = useState(false);

  async function refresh() {
    await updateScreen();
  }

  return (
    <div className={isLoading ? 'disable-container' : ''}>
      <div className="product-list-style">
        {isLoading && (<div className="view-loader"><CircularProgress /></div>)}
        <ProductHeader showProductAddForm={showProductAddForm} isAddProductBtnDisabled={isAddProductBtnDisabled} />
        {products.length == 0 && (
          <div className="no-slection no-slection-border-top">
            0 products added
          </div>
        )}
        {
          products.map((product) => (
            <ProductItem
              setIsLoading={setIsLoading}
              product={product}
              key={product.id}
              selectProduct={selectProduct}
              refresh={refresh}
              selectedCategoryId={selectedCategoryId}
              selectedProductId={selectedProductId}
              setError={setError} />
          ))
        }
      </div>
    </div>
  );
}
