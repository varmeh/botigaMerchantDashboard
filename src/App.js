import React from "react";
import { withRouter } from "react-router-dom";
import { AppRoutes } from "./components/AppRoutes";
import { SideNav } from "./components/common/side-nav/side-nav";
import { Error } from "./components/common/Error/Error";
import { fetchProfile } from "./services/auth-service";
import { getBanners } from "./services/profile-service";
import AppContext from "./contexts/AppContext";

import { fetchProducts } from "./services/product-service";
import { getCoupons } from "./services/profile-service";
import { getAggregateDelivery } from "./services/delivery-service";
import { NUMBER_OF_BANNERS } from "./helpers/validators";
import { LOGIN_VIEW, HOME_VIEW } from "./helpers/BotigaRouteFile";
import CircularProgress from "@material-ui/core/CircularProgress";

import "./App.css";

const SIDE_NAVIGATION_HIDDEN_FOR_ROUTES = ["/", "/verify-otp"];

class MyApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isError: false,
      products: [],
      coupons: [],
      banners: [...Array(NUMBER_OF_BANNERS).keys()].map((_) => null),
      aggregateDelivery: [],
      selectedDeliverydate: null,
      isMainViewLoading: false,
      brandName: "",
      maxRecommendedProducts: 0,
    };
  }

  _clearContext = () =>
    this.setState({
      error: null,
      isError: false,
      products: [],
      coupons: [],
      banners: [...Array(NUMBER_OF_BANNERS).keys()].map((_) => null),
      aggregateDelivery: [],
      selectedDeliverydate: null,
      isMainViewLoading: false,
      brandName: "",
      maxRecommendedProducts: 0,
    });

  _setBrandName = (name) => this.setState({ brandName: name });

  _setMaxRecommendedProducts = (val) =>
    this.setState({ maxRecommendedProducts: val });

  async componentDidMount() {
    try {
      const { data } = await fetchProfile();
      if (data.brand) {
        this._setBrandName(data.brand.name);
      }
      if (typeof data.maxRecommendedProducts === "number") {
        this._setMaxRecommendedProducts(data.maxRecommendedProducts);
      }
      this.props.history.replace(HOME_VIEW);
    } catch (err) {
      this._setError(true, err);
      this.props.history.replace(LOGIN_VIEW);
    }
  }

  async _fetchProductList() {
    try {
      const { data } = await fetchProducts();
      if (data) {
        this.setState({
          products: data,
        });
        return data;
      }
      return [];
    } catch (err) {
      this._setError(true, err);
    }
  }

  async _fetchCouponList() {
    try {
      const { data } = await getCoupons();
      if (data) {
        const { coupons = [] } = data;
        this.setState({
          coupons: coupons,
        });
        return coupons;
      }
      return [];
    } catch (err) {
      this._setError(true, err);
    }
  }

  _updateCategoryVisiblityInProductList(categoryId, value) {
    const tempProductsWithCategory = [...this.state.products];
    if (tempProductsWithCategory.length > 0) {
      const categoryToBeUpdated = tempProductsWithCategory.find(
        (_category) => _category.categoryId === categoryId
      );
      if (categoryToBeUpdated) {
        const updatedCategory = {
          ...categoryToBeUpdated,
          visible: value,
        };
        const updatedProductsWithCategory = tempProductsWithCategory.map(
          (_category) => {
            if (_category.categoryId !== categoryId) {
              return _category;
            } else {
              return updatedCategory;
            }
          }
        );
        this.setState({
          products: updatedProductsWithCategory,
        });
      }
    }
  }

  _updateProductRecomendation(categoryId, productId, recomendationStatus) {
    const tempProductsWithCategory = [...this.state.products];
    if (tempProductsWithCategory.length > 0) {
      const updatedProductsWithCategory = tempProductsWithCategory.map(
        (_category) => {
          if (_category.categoryId === categoryId) {
            const updatedProducts = _category.products.map((_product) => {
              if (_product.id === productId) {
                return {
                  ..._product,
                  recommended: recomendationStatus,
                };
              }
              return _product;
            });
            return {
              ..._category,
              products: updatedProducts,
            };
          }
          return _category;
        }
      );
      this.setState({
        products: updatedProductsWithCategory,
      });
    }
  }

  _fetchBanners = async () => {
    try {
      const { data: { banners = [] } = {} } = await getBanners();
      const bannersList = [...banners, ...this.state.banners].filter(
        (_, index) => index < NUMBER_OF_BANNERS
      );
      this.setState({
        banners: bannersList,
      });
    } catch (err) {
      this._setError(true, err);
    }
  };

  _updateLocalBannersList = (_bannerList) =>
    this.setState({
      banners: _bannerList,
    });

  async _fetchAggregateDelivery(date) {
    try {
      this._showMainViewLoader();
      const { data } = await getAggregateDelivery(date);
      this.setState({ aggregateDelivery: data });
      return data;
    } catch (err) {
      this._setError(true, err);
    } finally {
      this._hideMainViewLoader();
    }
  }

  _setSelectedDeliveryDate = (date) => {
    this.setState(
      {
        selectedDeliverydate: date,
      },
      () => this._fetchAggregateDelivery(this.state.selectedDeliverydate)
    );
  };

  _setError = (value, err) =>
    this.setState({
      isError: value,
      error: err ? err : null,
    });

  _setAggregateDelivery = (deliveryList) =>
    this.setState({
      aggregateDelivery: deliveryList,
    });

  _showMainViewLoader = () => this.setState({ isMainViewLoading: true });

  _hideMainViewLoader = () => this.setState({ isMainViewLoading: false });

  render() {
    const {
      location: { pathname = "" },
    } = this.props;
    const {
      isError,
      error,
      products,
      coupons,
      banners,
      aggregateDelivery,
      selectedDeliverydate,
      isMainViewLoading,
      brandName,
      maxRecommendedProducts,
    } = this.state;
    const includeSideBar =
      !SIDE_NAVIGATION_HIDDEN_FOR_ROUTES.includes(pathname);
    return (
      <AppContext.Provider
        value={{
          products: products,
          coupons: coupons,
          banners: banners,
          brandName: brandName,
          maxRecommendedProducts: maxRecommendedProducts,
          aggregateDelivery: aggregateDelivery,
          selectedDeliverydate: selectedDeliverydate,
          fetchCouponList: this._fetchCouponList.bind(this),
          fetchProductList: this._fetchProductList.bind(this),
          updateCategoryVisiblityInProductList:
            this._updateCategoryVisiblityInProductList.bind(this),
          updateProductRecomendation:
            this._updateProductRecomendation.bind(this),
          fetchBannerList: this._fetchBanners.bind(this),
          updateLocalBannersList: this._updateLocalBannersList.bind(this),
          fetchAggregateDelivery: this._fetchAggregateDelivery.bind(this),
          setSelectedDeliveryDate: this._setSelectedDeliveryDate,
          setError: this._setError,
          setAggregateDelivery: this._setAggregateDelivery,
          clearContext: this._clearContext,
          showMainViewLoader: this._showMainViewLoader,
          hideMainViewLoader: this._hideMainViewLoader,
          setBrandName: this._setBrandName,
        }}
      >
        <div className="app">
          {includeSideBar && <SideNav />}
          <div
            className={
              includeSideBar
                ? "main-content-sidebar"
                : "main-content-no-sidebar"
            }
          >
            <div className={isMainViewLoading ? "disable-container" : "no-css"}>
              {isMainViewLoading && (
                <div className="view-loader">
                  <CircularProgress />
                </div>
              )}
              <AppRoutes />
            </div>
          </div>
          {isError && <Error err={error} />}
        </div>
      </AppContext.Provider>
    );
  }
}

export const App = withRouter(MyApp);
