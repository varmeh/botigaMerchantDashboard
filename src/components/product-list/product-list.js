import React from "react";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import "./product-list.css";

function ProductHeader({ setAddProductMode }) {
  return (
    <div className="product-header-item">
      <div className="product-header-name">Product</div>
      <Button className="product-header-btn" onClick={() => setAddProductMode(true)}>+ ADD</Button>
    </div>
  );
}

function ProductItem({ product, selectProduct, selectedProductId }) {
  const { id, name, imageUrl } = product;
  let productItemClass = "product-item";

  if (id === selectedProductId) {
    productItemClass = `${productItemClass} item_selected`;
  }
  return (
    <div className={productItemClass} onClick={() => selectProduct(id)}>
      <div className="product-item-row-header">
        <div className="product-name">{name}</div>
        <FormControlLabel
          className="product-status-text"
          value="Available"
          control={<Switch color="primary" />}
          label="Available"
          labelPlacement="start"
          checked={true}
        />
      </div>
      <div className="product-item-row-description">
        <div className="product-secondary-text">
          <React.Fragment>
            <span className="text-light">
              12 Pieces •<del>&#8377; 550</del>
            </span>
            <span className="text-dark">&nbsp;&#8377;550</span>
          </React.Fragment>
          <div className="description text-light">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit...
          </div>
        </div>
        <ProductImage url={imageUrl} />
      </div>
    </div>
  );
}

function ProductImage({ url, name }) {
  return (
    <div className="product-item-image-container">
      <span className="badge">Best Seller</span>
      <img className="product-item-image" src={url} alt={name} />
    </div>
  );
}

export default function ProductList({ products, selectProduct, selectedProductId, setAddProductMode }) {
  return (
    <div className="product-list-style">
      <ProductHeader setAddProductMode={setAddProductMode} />
      {
        products.map((product) => (
          <ProductItem
            product={product}
            key={product.id}
            selectProduct={selectProduct}
            selectedProductId={selectedProductId} />
        ))
      }
    </div>
  );
}
