import React, { useState, useEffect } from "react";

import { fetchProducts } from "../../services/product-service";
import CategoryList from "../../components/category-list/category-list";
import ProductList from "../../components/product-list/product-list";
import ProductView from "../../components/product-view/product-view";

import "./store-screen.css";

function getCategoryList(products) {
    return products.map(category => ({
        categoryId: category.categoryId,
        name: category.name,
        count: category.products.length,
        displaytext: category.products.length > 1 ? `${category.products.length} items` : `${category.products.length} item`
    }));
}

function getProductList(products, selectedCategoryId) {
    const selectedProduct = products.find(product => product.categoryId === selectedCategoryId);
    if (selectedProduct) {
        return selectedProduct.products;
    } else {
        return [];
    }

}

function getSelectedProduct(products, selectedCategoryId, selectedProductId) {
    const productList = getProductList(products, selectedCategoryId);
    const product = productList.find(p => p.id === selectedProductId);
    return product;
}

export function StoreScreen() {
    const [products, setProducts] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [addProducMode, setAddProductMode] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        const { data } = await fetchProducts();
        if (data) {
            setProducts(data);
            if (data.length > 0) {
                const firstProductElement = data[0];
                if (firstProductElement) {
                    setSelectedCategoryId(firstProductElement.categoryId);
                }
            }
        }
    }

    function selectedCategory(categoryId) {
        setSelectedCategoryId(categoryId);
        setSelectedProductId(null);
        setAddProductMode(false);
    }

    function selectProduct(productId) {
        setSelectedProductId(productId);
        setAddProductMode(false);
    }


    return (
        <div className="store-screen-paper">
            <CategoryList
                categories={getCategoryList(products)}
                selectedCategoryId={selectedCategoryId}
                selectCategory={selectedCategory}
                loadProducts={loadProducts} />
            <ProductList
                products={getProductList(products, selectedCategoryId)}
                selectedProductId={selectedProductId}
                selectProduct={selectProduct}
                setAddProductMode={setAddProductMode} />
            <ProductView
                categories={getCategoryList(products)}
                product={getSelectedProduct(products, selectedCategoryId, selectedProductId)}
                addProducMode={addProducMode}
                setAddProductMode={setAddProductMode} />
        </div>
    )

}