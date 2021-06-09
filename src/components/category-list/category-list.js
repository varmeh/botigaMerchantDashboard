import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "../common/BotigatextField/botiga-textfield";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Switch from "@material-ui/core/Switch";
import IconButton from "@material-ui/core/IconButton";
import Edit from "@material-ui/icons/Edit";
import { Formik } from "formik";

import {
  addCategoryValidators,
  MAX_CHAR_CATEGORY,
} from "../../helpers/validators";
import {
  saveCategory,
  editCategory,
  deleteCategory,
  updateCategoryVisiblity,
} from "../../services/category-service";

import { saveProduct, deleteProduct } from "../../services/product-service";

import "./category-list.css";

function CategoryHeader({ handleClickOpen }) {
  return (
    <div className="category-header-item">
      <div className="category-header-name">Category</div>
      <Button className="category-header-btn" onClick={handleClickOpen}>
        + ADD
      </Button>
    </div>
  );
}

function CategoryItem({
  category,
  selectedCategoryId,
  selectCategory,
  refresh,
  setError,
  updateCategoryVisiblityInProductList,
  showMainViewLoader,
  hideMainViewLoader,
}) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [categoryVisiblity, setCategoryVisiblity] = useState(false);
  const [dragActiveCss, setDragActiveCss] = useState(false);

  const { categoryId, name, displaytext, count, visible } = category;
  let categortItemClass = "category-item";

  useEffect(() => {
    setCategoryVisiblity(visible);
  }, [visible]);

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
      await refresh(true);
      closeDeleteModal();
    } catch (err) {
      setError(true, err);
    }
  }

  async function _updateCategoryVisiblity(event) {
    const value = event.target.checked;
    try {
      setCategoryVisiblity(value);
      await updateCategoryVisiblity(category.categoryId, value);
      updateCategoryVisiblityInProductList(category.categoryId, value);
    } catch (err) {
      setCategoryVisiblity(!value);
      setError(true, err);
    }
  }

  function _selectCategory() {
    selectCategory(categoryId);
  }

  function allowDrop(ev) {
    ev.preventDefault();
    setDragActiveCss("drag-active");
  }

  function alowDragLeave(ev) {
    ev.preventDefault();
    setDragActiveCss("");
  }

  function drop(ev) {
    try {
      ev.preventDefault();
      var productData = ev.dataTransfer.getData("product");
      setDragActiveCss("");
      if (selectedCategoryId !== categoryId) {
        if (productData) {
          const product = JSON.parse(productData);
          updateProductCategory(product);
        }
      } else {
        setError(true, "Drag and drop to same categories not allowed");
      }
    } catch (err) {
      setError(true, err);
    }
  }

  async function updateProductCategory(product) {
    const {
      id,
      name,
      price,
      mrp,
      size,
      imageUrl,
      imageUrlLarge,
      description,
      secondaryImageUrls,
      available,
    } = product;
    try {
      const [quantity, unit] = (size || "").split(" ");
      showMainViewLoader();
      await saveProduct(
        categoryId,
        name,
        price,
        mrp,
        quantity,
        unit,
        imageUrl,
        imageUrlLarge,
        description,
        secondaryImageUrls,
        available
      );
      await deleteProduct(id, selectedCategoryId);
      await refresh(false);
      hideMainViewLoader();
    } catch (err) {
      setError(true, err);
    }
  }

  if (categoryId === selectedCategoryId) {
    categortItemClass = `${categortItemClass} item_selected`;
  }

  return (
    <div
      onDragOver={allowDrop}
      onDragLeave={alowDragLeave}
      onDrop={drop}
      className={`${categortItemClass} ${dragActiveCss}`}
      onClick={_selectCategory}
    >
      <div className="category-item-row">
        <div className="category-name">{name}</div>
        <Switch
          color="primary"
          checked={categoryVisiblity}
          onChange={_updateCategoryVisiblity}
          name={`categor-${categoryId}`}
        />
      </div>
      <div className="category-item-row">
        <div className="category-quantity">{displaytext}</div>
        <div className="no-classs">
          {count !== 0 ? (
            <IconButton
              aria-label="edit-category"
              onClick={handlOpenEditCategoryModal}
            >
              <Edit />
            </IconButton>
          ) : null}
          {count === 0 && (
            <IconButton aria-label="delete-category" onClick={openDeleteModal}>
              <DeleteOutline />
            </IconButton>
          )}
        </div>
      </div>
      <Formik
        validationSchema={addCategoryValidators}
        initialValues={{
          category: category.name,
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await editCategory(category.categoryId, values.category);
            await refresh();
            handleCloseEditCategoryModal();
          } catch (err) {
            setError(true, err);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ handleSubmit, getFieldProps, touched, errors, isSubmitting }) => (
          <Dialog
            fullWidth
            maxWidth="xs"
            open={openEdit}
            aria-labelledby="form-dialog-title"
            className="add-category-modal"
          >
            <DialogTitle className="add-category-modal-title">
              Add category
            </DialogTitle>
            <form onSubmit={handleSubmit}>
              <DialogContent style={{ marginBottom: 15 }}>
                <TextField
                  id="category"
                  {...getFieldProps("category")}
                  label="Category name"
                  type="text"
                  variant="outlined"
                  error={touched.category && errors.category}
                  inputProps={{ maxLength: MAX_CHAR_CATEGORY }}
                  requiresCounterValidation={true}
                  fullWidth
                />
              </DialogContent>
              <DialogActions className="add-category-action">
                <Button
                  size="large"
                  className="save-category-cancel"
                  onClick={handleCloseEditCategoryModal}
                  color="primary"
                >
                  Cancel
                </Button>
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  size="large"
                  className="save-category-btn"
                  variant="contained"
                  color="primary"
                  disableElevation
                >
                  {isSubmitting ? "Edit category ..." : "Edit category"}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        )}
      </Formik>
      <Dialog
        className="delete-category-modal"
        open={openDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete category"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this category ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteModal}>Cancel</Button>
          <Button
            startIcon={<DeleteOutline />}
            onClick={deleteAddedCategory}
            color="secondary"
            variant="contained"
            disableElevation
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default function CategoryList({
  categories,
  selectedCategoryId,
  selectCategory,
  updateScreen,
  setError,
  updateCategoryVisiblityInProductList,
  showMainViewLoader,
  hideMainViewLoader,
}) {
  const [openCategoryModal, setOpenCategoryModal] = useState(false);

  function handlOpenCategoryModal() {
    setOpenCategoryModal(true);
  }

  function handleCloseCategoryModal(resetForm) {
    return function () {
      if (typeof resetForm === "function") {
        resetForm();
      }
      setOpenCategoryModal(false);
    };
  }

  async function refresh(requiresInitialSelection) {
    try {
      await updateScreen(requiresInitialSelection);
    } catch (err) {
      setError(true, err);
    }
  }

  return (
    <div className="category-list-style">
      <CategoryHeader handleClickOpen={handlOpenCategoryModal} />
      {categories.length === 0 && (
        <div className="no-slection no-slection-border-top">
          Add categories to add products
        </div>
      )}
      <div className="category-list-body">
        {categories.map((category) => (
          <CategoryItem
            refresh={refresh}
            category={category}
            key={category.categoryId}
            selectedCategoryId={selectedCategoryId}
            selectCategory={selectCategory}
            setError={setError}
            updateCategoryVisiblityInProductList={
              updateCategoryVisiblityInProductList
            }
            showMainViewLoader={showMainViewLoader}
            hideMainViewLoader={hideMainViewLoader}
          />
        ))}
      </div>
      <Formik
        validationSchema={addCategoryValidators}
        initialValues={{ category: "" }}
        enableReinitialize
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            await saveCategory(values.category);
            await refresh();
            handleCloseCategoryModal(resetForm)();
          } catch (err) {
            setError(true, err);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          handleSubmit,
          getFieldProps,
          touched,
          errors,
          resetForm,
          isSubmitting,
        }) => (
          <Dialog
            fullWidth
            maxWidth="xs"
            open={openCategoryModal}
            aria-labelledby="form-dialog-title"
            className="add-category-modal"
          >
            <DialogTitle className="add-category-modal-title">
              Add category
            </DialogTitle>
            <form onSubmit={handleSubmit}>
              <DialogContent style={{ marginBottom: 15 }}>
                <TextField
                  id="category"
                  {...getFieldProps("category")}
                  label="Category name"
                  type="text"
                  variant="outlined"
                  error={touched.category && errors.category}
                  fullWidth
                  inputProps={{ maxLength: MAX_CHAR_CATEGORY }}
                  requiresCounterValidation={true}
                />
              </DialogContent>
              <DialogActions className="add-category-action">
                <Button
                  size="large"
                  className="save-category-cancel"
                  onClick={handleCloseCategoryModal(resetForm)}
                >
                  Cancel
                </Button>
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  size="large"
                  className="save-category-btn"
                  variant="contained"
                  color="primary"
                  disableElevation
                >
                  {isSubmitting ? "Save category ..." : "Save category"}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        )}
      </Formik>
    </div>
  );
}
