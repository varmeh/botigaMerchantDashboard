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

export default function ProductView({ product, categories, addProducMode, setAddProductMode }) {
    return <div className="product-details-style">
        <ProductDetailsHeader />
        {
            addProducMode
                ? <AddNewProduct categories={categories} />
                : <ProductDetails
                    product={product}
                    setAddProductMode={setAddProductMode} />
        }
    </div>
}