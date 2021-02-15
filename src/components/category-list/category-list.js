import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import "./category-list.css";

function CategoryHeader({ handleClickOpen }) {
    return (
        <div className="category-header-item">
            <div className="category-header-name">Category</div>
            <Button className="category-header-btn" onClick={handleClickOpen}>+ ADD</Button>
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
    const [open, setOpen] = useState(false);

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    return (
        <div className="category-list-style">
            <CategoryHeader handleClickOpen={handleClickOpen} />
            {
                categories.map((category => (
                    <CategoryItem
                        category={category}
                        key={category.categoryId}
                        selectedCategoryId={selectedCategoryId}
                        selectCategory={selectCategory} />)
                ))
            }
            <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose} aria-labelledby="form-dialog-title" className="add-category-modal">
                <DialogTitle className="add-category-modal-title">Add category</DialogTitle>
                <DialogContent style={{ marginBottom: 15 }}>
                    <TextField
                        id="name"
                        label="Category name"
                        type="text"
                        variant="outlined"
                        className="category-name-textfield"
                        fullWidth />
                </DialogContent>
                <DialogActions className="add-category-action">
                    <Button size="large" className="save-category-cancel" onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button size="large" className="save-category-btn" onClick={handleClose} variant="contained" color="primary" disableElevation>
                        Save category
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}