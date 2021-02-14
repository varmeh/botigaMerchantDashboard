import React from 'react';
import Button from '@material-ui/core/Button';

import "./category-list.css";

function CategoryHeader() {
    return (
        <div className="category-header-item">
            <div className="category-header-name">Category</div>
            <Button className="category-header-btn">+ ADD</Button>
        </div>
    )
}


function CategoryItem({ category, selectedCategoryId, selectCategory }) {
    const { categoryId, name, displaytext } = category;
    let categortItemClass = "category-item";

    if (categoryId === selectedCategoryId) {
        categortItemClass = `${categortItemClass} item_selected`;
    }

    return (
        <div className={categortItemClass} onClick={() => selectCategory(categoryId)}>
            <div className="category-name">{name}</div>
            <div className="category-quantity">{displaytext}</div>
        </div>
    );
}

export default function CategoryList({ categories, selectedCategoryId, selectCategory }) {
    return (
        <div className="category-list-style">
            <CategoryHeader />
            {
                categories.map((category => (
                    <CategoryItem
                        category={category}
                        key={category.categoryId}
                        selectedCategoryId={selectedCategoryId}
                        selectCategory={selectCategory} />)
                ))
            }
        </div>
    );
}