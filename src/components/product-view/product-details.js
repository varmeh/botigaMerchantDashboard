import React from 'react';
import { AddNewProduct } from "./add-new-product";

export function ProductDetails({ product, refresh, selectedCategoryId, hideShowAddProductForm }) {
    return (
        product != null
            ? <AddNewProduct
                product={product}
                refresh={refresh}
                selectedCategoryId={selectedCategoryId}
                hideShowAddProductForm={hideShowAddProductForm}
            />
            : (
                <div className="product-details-body">
                    <div className="no-product-slected">
                        No Product Selected
                    </div>
                </div>
            )
    );
}