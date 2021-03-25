import React, { useState } from 'react'
import './delivery-list.css'
import paidStamp from '../../../assets/icons/paid.svg'
import {
	statusMessage,
	statusColor,
	transformedStatusFilterList
} from '../../../helpers/util'
import Popover from '@material-ui/core/Popover'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Radio from '@material-ui/core/Radio'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'

function DeliveryListHeader({
	deliveryFilterList,
	setFilterList,
	deliveriesForSelectedCommunity = []
}) {
	const [anchorEl, setAnchorEl] = useState(null)

	const handleClick = event => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	const open = Boolean(anchorEl)
	const id = open ? 'delivery-filter' : undefined

	const avialbleStatus = [
		{ status: 'all', displayText: 'All' },
		{ status: 'only-open', displayText: 'Open' },
		{ status: 'out', displayText: 'Shipped' },
		{ status: 'delivered', displayText: 'Delivered' },
		{ status: 'cancelled', displayText: 'Cancelled' }
	]

	const isfilterWithStatusChecked = status =>
		deliveryFilterList.includes(status)

	const handleChange = event => {
		setFilterList(event.target.value)
		handleClose()
	}

	const getDisaplyTextForStatus = () => {
		const deliverySelectedStatus = deliveryFilterList[0]
		const statusEl = avialbleStatus.find(
			el => el.status === deliverySelectedStatus
		)
		return statusEl ? statusEl.displayText : ''
	}

	const orderStausCount = deliveriesForSelectedCommunity.reduce(
		(acc, _delivery) => {
			const {
				order: { status }
			} = _delivery
			const tempAcc = { ...acc }
			tempAcc['all'] = tempAcc['all'] + 1

			if (status === 'open' || status === 'delayed') {
				tempAcc['only-open'] = tempAcc['only-open'] + 1
			} else if (status === 'out') {
				tempAcc['out'] = tempAcc['out'] + 1
			} else if (status === 'delivered') {
				tempAcc['delivered'] = tempAcc['delivered'] + 1
			} else if (status === 'cancelled') {
				tempAcc['cancelled'] = tempAcc['cancelled'] + 1
			}
			return tempAcc
		},
		{
			all: 0,
			'only-open': 0,
			out: 0,
			delivered: 0,
			cancelled: 0
		}
	)

	return (
		<div className='community-header-item'>
			<div className='community-header-name'>DELIVERIES</div>
			<div className='no-class'>
				<Button
					onClick={handleClick}
					endIcon={<ExpandMore />}
					className='filter-list-btn'>
					{getDisaplyTextForStatus()}
				</Button>
				<Popover
					id={id}
					open={open}
					anchorEl={anchorEl}
					onClose={handleClose}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
					transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
					<div className='delivery-filter-container'>
						{avialbleStatus.map(_entry => (
							<div className='delivery-filter-item'>
								<div className='delivery-item-delivery-info'>
									<span className={statusColor(_entry.status)} />
									<span>
										{_entry.displayText}&nbsp;({orderStausCount[_entry.status]})
									</span>
								</div>
								<Radio
									checked={isfilterWithStatusChecked(_entry.status)}
									onChange={handleChange}
									value={_entry.status}
									name='filter-status'
									inputProps={{ 'aria-label': _entry.displayText }}
								/>
							</div>
						))}
					</div>
				</Popover>
			</div>
		</div>
	)
}

function DeliveryItem({
	delivery,
	setSelectedDeliveryId,
	selectedDeliveryId,
	selectedOpenOrders,
	selectedOutforDeliveryOrders,
	setUnsetOrderListIds,
	deliveryFilterList
}) {
	const {
		buyer: { house, name },
		order: { number, products, totalAmount, status: orderStatus },
		payment: { status: paymentStatus },
		_id
	} = delivery
	const itemText =
		products.length > 1 ? `${products.length} items` : `${products.length} item`

	const showCheckBoxForStatus = ['open', 'out', 'delayed']
	const notAllowedFilters = ['all', 'delivered', 'cancelled']

	function selectDeliveryId() {
		setSelectedDeliveryId(number)
	}

	const selectedClass =
		selectedDeliveryId === number
			? 'delivery-item item_selected'
			: 'delivery-item'

	const isCheckBoxSelected =
		selectedOpenOrders.includes(_id) ||
		selectedOutforDeliveryOrders.includes(_id)

	function handleOrderCheckBoxChange() {
		if (orderStatus === 'open' || orderStatus === 'delayed') {
			setUnsetOrderListIds(_id, 'only-open')
		} else if (orderStatus === 'out') {
			setUnsetOrderListIds(_id, 'out')
		}
	}

	const showCheckBox =
		showCheckBoxForStatus.includes(orderStatus) &&
		!notAllowedFilters.includes(deliveryFilterList[0])

	return (
		<div className={selectedClass} onClick={selectDeliveryId}>
			<div className='delivery-item-row-with-checkbox'>
				{showCheckBox && (
					<Checkbox
						color='primary'
						size='small'
						checked={isCheckBoxSelected}
						onChange={handleOrderCheckBoxChange}
						inputProps={{ 'aria-label': 'select order' }}
					/>
				)}
				<div className='delivery-item-row-container'>
					<div className='delivery-item-row'>
						<div className='no-class'>
							<div className='delivery-item-order-info'>
								{house}, {name}
							</div>
							<div className='delivery-item-delivery-info uppercase'>
								#{number} . {itemText}
							</div>
						</div>
						<div className='delivery-item-delivery-info-order-status'>
							<span className={statusColor(orderStatus)} />
							{statusMessage(orderStatus)}
						</div>
					</div>
					<div className='delivery-item-row'>
						<div className='delivery-item-delivery-info total-amount'>
							₹{totalAmount}
						</div>
						{paymentStatus === 'success' ? (
							<div className='paid-stamp-conatiner'>
								<img alt='paid-stamp' src={paidStamp} className='paid-stamp' />
							</div>
						) : null}
					</div>
				</div>
			</div>
		</div>
	)
}

export default function DeliveryList({
	deliveriesForSelectedCommunity = [],
	deliveryFilterList,
	setFilterList,
	setSelectedDeliveryId,
	selectedDeliveryId,
	selectedOpenOrders,
	selectedOutforDeliveryOrders,
	setUnsetOrderListIds
}) {
	const statusFilterList = transformedStatusFilterList(deliveryFilterList)
	const AllDeliveriesForSelectedCommunity =
		statusFilterList.length > 0
			? deliveriesForSelectedCommunity.filter(_delivery =>
					statusFilterList.includes(_delivery.order.status)
			  )
			: deliveriesForSelectedCommunity

	return (
		<div className='product-list-style'>
			<DeliveryListHeader
				deliveryFilterList={deliveryFilterList}
				setFilterList={setFilterList}
				deliveriesForSelectedCommunity={deliveriesForSelectedCommunity}
			/>
			<div className='delivery-list-body'>
				{AllDeliveriesForSelectedCommunity.length > 0 ? (
					AllDeliveriesForSelectedCommunity.map((_delivery, i) => (
						<DeliveryItem
							key={i}
							delivery={_delivery}
							selectedDeliveryId={selectedDeliveryId}
							setSelectedDeliveryId={setSelectedDeliveryId}
							selectedOpenOrders={selectedOpenOrders}
							selectedOutforDeliveryOrders={selectedOutforDeliveryOrders}
							setUnsetOrderListIds={setUnsetOrderListIds}
							deliveryFilterList={deliveryFilterList}
						/>
					))
				) : (
					<div className='no-slection no-slection-border-top'>
						No result found
					</div>
				)}
			</div>
		</div>
	)
}
