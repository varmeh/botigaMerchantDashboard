import React, { useState, useEffect, useContext } from "react";
import appContext from "../../contexts/AppContext";
import CouponList from "../../components/coupon-view/coupon-list/coupon-list";
import CouponSettings from "../../components/coupon-view/coupon-settings/coupon-settings";
import BotigaPageView from "../../components/common/BotigaPageView/BotigaPageView";

export function CouponScreen() {
    const { fetchCouponList, coupons, setError } = useContext(appContext);
    const [selectedCouponId, setSelectedCouponId] = useState(null);
    const [isAddCoupon, setIsAddCoupon] = useState(false);

    useEffect(() => {
        initCouponList();
    }, []);

    function setInitialCouponSelection(coupontList) {
        if (coupontList.length > 0) {
            const firstCouponElement = coupontList[0];
            if (firstCouponElement) {
                setSelectedCouponId(firstCouponElement.couponId);
            }
        }
    }

    async function initCouponList() {
        try {
            if (coupons.length > 0) {
                setInitialCouponSelection(coupons);
            } else {
                const couponsList = await fetchCouponList();
                setInitialCouponSelection(couponsList);
            }
        } catch (err) {
            setError(true, err);
        }
    }

    function selectCoupon(couponId) {
        setSelectedCouponId(couponId);
        setIsAddCoupon(false);
    }

    function openAddCouponForm() {
        setIsAddCoupon(true);
        setSelectedCouponId(null);
    }

    function closeAddCouponForm() {
        setIsAddCoupon(false);
        setSelectedCouponId(null);
    }

    function getSelectedCoupon(_selectedCouponId) {
        return coupons.find(coupon => coupon.couponId == _selectedCouponId);
    }

    return (
        <BotigaPageView>
            <CouponList
                selectedCouponId={selectedCouponId}
                selectCoupon={selectCoupon}
                coupons={coupons}
                openAddCouponForm={openAddCouponForm}
            />
            <CouponSettings
                isAddCoupon={isAddCoupon}
                closeAddCouponForm={closeAddCouponForm}
                coupon={getSelectedCoupon(selectedCouponId)}
                setError={setError} />
        </BotigaPageView>
    )
}