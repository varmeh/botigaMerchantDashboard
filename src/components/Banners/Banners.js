import React, { useEffect, useState, useContext } from 'react'
import appContext from "../../contexts/AppContext";
import { UploadBannerComponent } from './UploadBanner'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Image } from '../../components/common/Image/Image'
import CloseIcon from '@material-ui/icons/Close'
import { deleteProductImage } from '../../services/common-service'
import { updateBanners } from '../../services/profile-service'

import './index.css'


function BannersHeader() {
	return (
		<div className='banner-header-item'>
			<div className='banner-header-name'>BANNER</div>
		</div>
	)
}

function UploadBanner({
	index,
	setError,
	setIsLoading,
	banner,
	banners,
	setBannerAtIndex,
	removeBannerAtIndex
}) {
	async function deleteBanner() {
		try {
			setIsLoading(true)
			let bannerList = [...banners]
			const nonEmptyBannersWithRemovedBanner = bannerList
				.map(_banner => (_banner !== banner ? _banner : null))
				.filter(_banner => _banner)
			await deleteProductImage(banner)
			await updateBanners(nonEmptyBannersWithRemovedBanner)
			removeBannerAtIndex(index)
		} catch (err) {
			setError(true, err)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='banner-row'>
			{banner ? (
				<div className='banner-preview-container'>
					<Image
						src={banner}
						alt={`banner${index}`}
						className='banner-preview-img'
					/>
					<CloseIcon className='banner-preview-close' onClick={deleteBanner} />
				</div>
			) : (
					<UploadBannerComponent
						setError={setError}
						setIsLoading={setIsLoading}
						setBannerAtIndex={setBannerAtIndex}
						banners={banners}
						index={index}
					/>
				)}
		</div>
	)
}


export function Banners() {
	const [isLoading, setIsLoading] = useState(false);
	const { banners, fetchBannerList, updateLocalBannersList, setError } = useContext(appContext);

	useEffect(() => {
		initBannerList()
	}, [])

	async function initBannerList() {
		try {
			if (banners.filter(banner => banner).length === 0) {
				await fetchBannerList();
			}
		} catch (err) {
			setError(true, err);
		}
	}

	function setBannerAtIndex(banner, index) {
		const bannerList = [...banners]
		bannerList[index] = banner;
		updateLocalBannersList(bannerList);
	}

	function removeBannerAtIndex(index) {
		const bannerList = [...banners]
		bannerList[index] = null
		updateLocalBannersList(bannerList);
	}

	function _setIsLoading(value) {
		setIsLoading(value);
	}

	const containerClass = isLoading
		? 'banner-list-style disable-container'
		: 'banner-list-style';

	return (
		<div className={containerClass}>
			{isLoading && (
				<div className='view-loader'>
					<CircularProgress />
				</div>
			)}
			<BannersHeader />
			<div className='banner-body'>
				<div className='banner-row'>
					<div className='banner_info'>
						<div className='block_section'>
							<div className='primary'>format</div>
							<div className='secondary'>PNG | JPG | JPEG</div>
						</div>
						<div className='block_section'>
							<div className='primary'>dimension</div>
							<div className='secondary'> 960 px x 480 px</div>
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
						setIsLoading={_setIsLoading}
						banner={_banner}
						banners={banners}
						setBannerAtIndex={setBannerAtIndex}
						removeBannerAtIndex={removeBannerAtIndex}
					/>
				))}
			</div>
		</div>
	);
}