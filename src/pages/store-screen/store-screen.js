import React, { useState, useEffect, useContext } from "react";
import appContext from "../../contexts/AppContext";
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
    const { fetchProductList, products, setError } = useContext(appContext);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [isAddProduct, setIsAddProduct] = useState(false);

    useEffect(() => {
        initProductList();
    }, []);

    function selectedCategory(categoryId) {
        setSelectedCategoryId(categoryId);
        setSelectedProductId(null);
        setIsAddProduct(false);
    }

    function selectProduct(productId) {
        setIsAddProduct(false);
        setSelectedProductId(productId);
    }

    function showProductAddForm() {
        setSelectedProductId(null);
        setIsAddProduct(true);
    }

    function hideShowAddProductForm() {
        setSelectedProductId(null);
        setIsAddProduct(false);
    }

    function setInitialCategorySelection(productList) {
        if (productList.length > 0) {
            const firstProductElement = productList[0];
            if (firstProductElement) {
                setSelectedCategoryId(firstProductElement.categoryId);
            }
        }
    }

    async function initProductList() {
        try {
            if (products.length > 0) {
                setInitialCategorySelection(products);
            } else {
                const productList = await fetchProductList();
                setInitialCategorySelection(productList);
            }
        } catch (err) { }
        finally { }
    }

    async function updateScreen() {
        try {
            await fetchProductList();
            setIsAddProduct(false);
        } catch (err) { }
        finally { }
    }

    const isAddProductBtnDisabled = getCategoryList(products).length === 0;

    return (
        <div className="store-screen-paper">
            <CategoryList
                categories={getCategoryList(products)}
                selectedCategoryId={selectedCategoryId}
                selectCategory={selectedCategory}
                updateScreen={updateScreen} />
            <ProductList
                isAddProductBtnDisabled={isAddProductBtnDisabled}
                products={getProductList(products, selectedCategoryId)}
                selectedProductId={selectedProductId}
                selectedCategoryId={selectedCategoryId}
                selectProduct={selectProduct}
                showProductAddForm={showProductAddForm}
                updateScreen={updateScreen}
                setError={setError} />
            <ProductView
                selectedCategoryId={selectedCategoryId}
                product={getSelectedProduct(products, selectedCategoryId, selectedProductId)}
                isAddProduct={isAddProduct}
                hideShowAddProductForm={hideShowAddProductForm}
                updateScreen={updateScreen} />
        </div>
    )

}