import { React } from "react";
import { ProductDetails } from "./product-details";
import { AddNewProduct } from './add-new-product';

import "./index.css";

function ProductDetailsHeader() {
    return (
        <div className="product-details-header-item">
            <div className="product-details-header-name">Product details</div>

        </div>
    );
}

export default function ProductView({ product, selectedCategoryId, isAddProduct, hideShowAddProductForm, loadProducts }) {
    const defaultProduct = {};
    async function refresh() {
        loadProducts();
    }

    return <div className="product-details-style">
        <ProductDetailsHeader />
        {
            isAddProduct
                ? <AddNewProduct
                    refresh={refresh}
                    hideShowAddProductForm={hideShowAddProductForm}
                    selectedCategoryId={selectedCategoryId}
                    product={defaultProduct} />
                : <ProductDetails
                    refresh={refresh}
                    hideShowAddProductForm={hideShowAddProductForm}
                    selectedCategoryId={selectedCategoryId}
                    product={product} />
        }
    </div>
}