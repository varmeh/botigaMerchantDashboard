import React from "react";
import { AddNewProduct } from "./add-new-product";

export function ProductDetails({
  product,
  refresh,
  selectedCategoryId,
  hideShowAddProductForm,
  setError,
  updateProductRecomendation,
  maxRecommendedProducts,
}) {
  return product != null ? (
    <AddNewProduct
      product={product}
      refresh={refresh}
      selectedCategoryId={selectedCategoryId}
      hideShowAddProductForm={hideShowAddProductForm}
      setError={setError}
      updateProductRecomendation={updateProductRecomendation}
      maxRecommendedProducts={maxRecommendedProducts}
    />
  ) : (
    <div className="product-details-body">
      <div className="no-slection">No product selected</div>
    </div>
  );
}
