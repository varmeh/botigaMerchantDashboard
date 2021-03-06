import React, { useContext, useEffect } from "react";
import appContext from "../../contexts/AppContext";
import BotigaPageView from "../../components/common/BotigaPageView/BotigaPageView";
import SearchBar from "../../components/common/search-bar/search-bar";
import CommunityList from "../../components/community-list/community-list";

export function DeliveryScreen() {
    const screenName = 'Delivery';
    const { apartments, fetchApartments, setError } = useContext(appContext);

    useEffect(() => {
        initApartmentList();
    }, []);

    async function initApartmentList() {
        try {
            if (apartments.length > 0) {
                // set selection logic
            } else {
                //fetch list and set initial selection logic
                await fetchApartments();
            }
        } catch (err) {
            setError(true, err);
        }
    }

    return (
        <React.Fragment>
            <SearchBar screenName={screenName} reset={() => { }} handleChange={() => { }} searchValue={""} placeHolder={"Enter order or phone number..."} />
            <BotigaPageView>
                <CommunityList
                    communties={apartments} />
            </BotigaPageView>
        </React.Fragment>
    );

}