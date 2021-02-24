import React from 'react';
import { AddNewProduct } from "./add-new-product";

export function ProductDetails({ product, refresh, selectedCategoryId, hideShowAddProductForm, setError }) {
    return (
        product != null
            ? <AddNewProduct
                product={product}
                refresh={refresh}
                selectedCategoryId={selectedCategoryId}
                hideShowAddProductForm={hideShowAddProductForm}
                setError={setError}
            />
            : (
                <div className="product-details-body">
                    <div className="no-slection">
                        No product selected
                    </div>
                </div>
            )
    );
}