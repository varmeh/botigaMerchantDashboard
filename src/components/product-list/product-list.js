import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { updateProductStatus } from "../../services/product-service";

import "./product-list.css";

function ProductHeader({ setAddProductMode }) {
  return (
    <div className="product-header-item">
      <div className="product-header-name">Product</div>
      <Button className="product-header-btn" onClick={() => setAddProductMode(true)}>+ ADD</Button>
    </div>
  );
}

function ProductItem({ product, selectProduct, selectedProductId, selectedCategoryId, refresh }) {
  const { id, name, imageUrl, size, price, description, available } = product;
  const [productStatus, setProductStatus] = useState(available);
  let productItemClass = "product-item";

  async function changeProductStatus() {
    let oldStatus = productStatus;
    setProductStatus(!productStatus);
    try {
      await updateProductStatus(selectedCategoryId, product, !productStatus);
      await refresh();
    } catch (err) {
      setProductStatus(oldStatus);
    }
  }

  if (id === selectedProductId) {
    productItemClass = `${productItemClass} item_selected`;
  }

  return (
    <div className={productItemClass} onClick={() => selectProduct(id)}>
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
          <React.Fragment>
            <span className="text-light">
              {size} •<del>&#8377; {price}</del>
            </span>
            <span className="text-dark">&nbsp;&#8377;{price}</span>
          </React.Fragment>
          <div className="description text-light">
            {description}
          </div>
        </div>
        {imageUrl && <ProductImage url={imageUrl} />}
      </div>
    </div>
  );
}

const ProductImage = React.memo(function ({ url, name }) {
  return (
    <div className="product-item-image-container">
      <span className="badge">Best Seller</span>
      <img className="product-item-image" src={url} alt={name} />
    </div>
  );
});

export default function ProductList({ products, selectProduct, selectedCategoryId, selectedProductId, setAddProductMode, loadProducts }) {

  async function refresh() {
    loadProducts();
  }

  return (
    <div className="product-list-style">
      <ProductHeader setAddProductMode={setAddProductMode} />
      {
        products.map((product) => (
          <ProductItem
            product={product}
            key={product.id}
            selectProduct={selectProduct}
            refresh={refresh}
            selectedCategoryId={selectedCategoryId}
            selectedProductId={selectedProductId} />
        ))
      }
    </div>
  );
}
