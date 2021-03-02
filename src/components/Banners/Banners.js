import React from "react";
import AppContext from "../../contexts/AppContext";
import { UploadBannerComponent } from "./UploadBanner";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Image } from "../../components/common/Image/Image";
import CloseIcon from '@material-ui/icons/Close';
import { deleteProductImage } from "../../services/common-service";
import { getBanners, updateBanners } from "../../services/profile-service";


import "./index.css";

const NUMBER_OF_BANNERS = 3;


function BannersHeader() {
    return (
        <div className="banner-header-item">
            <div className="banner-header-name">BANNER</div>
        </div>
    );
}

function UploadBanner({ index, setError, setIsLoading, banner, banners, setBannerAtIndex, removeBannerAtIndex }) {

    async function deleteBanner() {
        try {
            setIsLoading(true);
            let bannerList = [...banners];
            const nonEmptyBannersWithRemovedBanner = bannerList
                .map(_banner => _banner !== banner ? _banner : null)
                .filter(_banner => _banner);
            await deleteProductImage(banner);
            await updateBanners(nonEmptyBannersWithRemovedBanner);
            removeBannerAtIndex(index);
        } catch (err) {
            setError(true, err);
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="banner-row">
            {banner
                ? (
                    <div className="banner-preview-container">
                        <Image src={banner} alt={`banner${index}`} className="banner-preview-img" />
                        <CloseIcon className="banner-preview-close" onClick={deleteBanner} />
                    </div>
                )
                : <UploadBannerComponent setError={setError} setIsLoading={setIsLoading} setBannerAtIndex={setBannerAtIndex} banners={banners} index={index} />}
        </div>
    );
}

export class Banners extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            banners: [...Array(NUMBER_OF_BANNERS).keys()].map(_ => null),
        }
    }

    componentDidMount() {
        this._fetchBanners();
    }

    _fetchBanners = async () => {
        try {
            this._setIsLoading(true);
            const { data: { banners = [] } = {} } = await getBanners();
            const bannersList = [...banners, ...this.state.banners].filter((_, index) => index < NUMBER_OF_BANNERS);
            this.setState({
                banners: bannersList
            });
        } catch (err) {

        } finally {
            this._setIsLoading(false);
        }
    }

    _setBannerAtIndex = (banner, index) => {
        const bannerList = [...this.state.banners];
        bannerList[index] = banner;
        this.setState({
            banners: bannerList
        });
    }

    _removeBannerAtIndex = (index) => {
        const bannerList = [...this.state.banners];
        bannerList[index] = null;
        this.setState({
            banners: bannerList
        });
    }

    _setIsLoading = (value) => this.setState({
        isLoading: value
    });


    render() {
        const { isLoading, banners } = this.state;
        const containerClass = isLoading ? 'banner-list-style disable-container' : 'banner-list-style';
        return (
            <AppContext.Consumer>
                {({ setError }) => (
                    <div className={containerClass}>
                        {isLoading && (
                            <div className='view-loader'>
                                <CircularProgress />
                            </div>
                        )}
                        <BannersHeader />
                        <div className="banner-body">
                            <div className="banner-row">
                                <div className='banner_info'>
                                    <div className='block_section'>
                                        <div className='primary'>format</div>
                                        <div className='secondary'>PNG | JPG | JPEG</div>
                                    </div>
                                    <div className='block_section'>
                                        <div className='primary'>dimension</div>
                                        <div className='secondary'> 915 px x 360 px</div>
                                    </div>
                                    <div className='block_section'>
                                        <div className='primary'>size</div>
                                        <div className='secondary'>20 MB Max.</div>
                                    </div>
                                </div>
                            </div>
                            {banners.map((_banner, index) => (
                                <UploadBanner
                                    key={index}
                                    index={index}
                                    setError={setError}
                                    setIsLoading={this._setIsLoading}
                                    banner={_banner}
                                    banners={banners}
                                    setBannerAtIndex={this._setBannerAtIndex}
                                    removeBannerAtIndex={this._removeBannerAtIndex}
                                />))}
                        </div>
                    </div>
                )}
            </AppContext.Consumer>
        )
    }

}