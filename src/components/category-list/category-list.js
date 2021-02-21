import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import { Formik } from 'formik';

import { addCategoryValidators } from "../../helpers/validators";
import { saveCategory, editCategory, deleteCategory } from "../../services/category-service";

import "./category-list.css";

function CategoryHeader({ handleClickOpen }) {
    return (
        <div className="category-header-item">
            <div className="category-header-name">Category</div>
            <Button className="category-header-btn" onClick={handleClickOpen}>+ ADD</Button>
        </div>
    )
}


function CategoryItem({ category, selectedCategoryId, selectCategory, loadProducts }) {
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const { categoryId, name, displaytext } = category;
    let categortItemClass = "category-item";

    function handlOpenEditCategoryModal() {
        setOpenEdit(true);
    }

    function handleCloseEditCategoryModal() {
        setOpenEdit(false);
    }

    function openDeleteModal() {
        setOpenDelete(true);
    }

    function closeDeleteModal() {
        setOpenDelete(false);
    }

    async function deleteAddedCategory() {
        try {
            await deleteCategory(category.categoryId);
            await loadProducts();
            closeDeleteModal();
        } catch (err) {

        }
    }

    if (categoryId === selectedCategoryId) {
        categortItemClass = `${categortItemClass} item_selected`;
    }

    return (
        <div className={categortItemClass} onClick={() => selectCategory(categoryId)}>
            <div className="category-name">{name}</div>
            <div className="category-item-action">
                <div className="category-quantity">{displaytext}</div>
                <Edit fontSize="small" onClick={handlOpenEditCategoryModal} />
                <DeleteIcon fontSize="small" onClick={openDeleteModal} />
            </div>
            <Formik
                validationSchema={addCategoryValidators}
                initialValues={{
                    category: category.name,
                }}
                onSubmit={
                    async (values) => {
                        await editCategory(category.categoryId, values.category);
                        await loadProducts();
                        handleCloseEditCategoryModal();
                    }
                }>
                {({ handleSubmit, getFieldProps, touched, errors }) => (
                    <Dialog fullWidth maxWidth="xs" open={openEdit} aria-labelledby="form-dialog-title" className="add-category-modal">
                        <DialogTitle className="add-category-modal-title">Add category</DialogTitle>
                        <form onSubmit={handleSubmit}>
                            <DialogContent style={{ marginBottom: 15 }}>
                                <TextField
                                    id="category"
                                    {...getFieldProps('category')}
                                    label="Category name"
                                    type="text"
                                    variant="outlined"
                                    className="category-name-textfield"
                                    error={touched.category && errors.category}
                                    helperText={errors.category}
                                    fullWidth />
                            </DialogContent>
                            <DialogActions className="add-category-action">
                                <Button size="large" className="save-category-cancel" onClick={handleCloseEditCategoryModal} color="primary">
                                    Cancel
                            </Button>
                                <Button type="submit" size="large" className="save-category-btn" variant="contained" color="primary" disableElevation>
                                    Edit category
                            </Button>
                            </DialogActions>
                        </form>
                    </Dialog>
                )}
            </Formik>
            <Dialog
                open={openDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"Delete category?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this category
                     </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteModal}>
                        Cancel
                    </Button>
                    <Button startIcon={<DeleteIcon />} onClick={deleteAddedCategory} color="secondary" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    );
}

export default function CategoryList({ categories, selectedCategoryId, selectCategory, loadProducts }) {
    const [openCategoryModal, setOpenCategoryModal] = useState(false);

    function handlOpenCategoryModal() {
        setOpenCategoryModal(true);
    }

    function handleCloseCategoryModal() {
        setOpenCategoryModal(false);
    }

    return (
        <div className="category-list-style">
            <CategoryHeader handleClickOpen={handlOpenCategoryModal} />
            {
                categories.map((category => (
                    <CategoryItem
                        loadProducts={loadProducts}
                        category={category}
                        key={category.categoryId}
                        selectedCategoryId={selectedCategoryId}
                        selectCategory={selectCategory} />)
                ))
            }
            <Formik
                validationSchema={addCategoryValidators}
                initialValues={{ category: '' }}
                onSubmit={
                    async (values) => {
                        console.log(values);
                        try {
                            await saveCategory(values.category);
                            await loadProducts();
                            handleCloseCategoryModal();
                        } catch (err) {

                        }
                    }
                }>
                {({ handleSubmit, getFieldProps, touched, errors }) => (
                    <Dialog fullWidth maxWidth="xs" open={openCategoryModal} aria-labelledby="form-dialog-title" className="add-category-modal">
                        <DialogTitle className="add-category-modal-title">Add category</DialogTitle>
                        <form onSubmit={handleSubmit}>
                            <DialogContent style={{ marginBottom: 15 }}>
                                <TextField
                                    id="category"
                                    {...getFieldProps('category')}
                                    label="Category name"
                                    type="text"
                                    variant="outlined"
                                    className="category-name-textfield"
                                    error={touched.category && errors.category}
                                    helperText={errors.category}
                                    fullWidth />
                            </DialogContent>
                            <DialogActions className="add-category-action">
                                <Button size="large" className="save-category-cancel" onClick={handleCloseCategoryModal} color="primary">
                                    Cancel
                            </Button>
                                <Button type="submit" size="large" className="save-category-btn" variant="contained" color="primary" disableElevation>
                                    Save category
                            </Button>
                            </DialogActions>
                        </form>
                    </Dialog>
                )}
            </Formik>
        </div>
    );
}