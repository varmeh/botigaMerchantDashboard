import React, { useState } from 'react'
import { Formik } from 'formik'
import TextField from '../../common/BotigatextField/botiga-textfield'
import CircularProgress from '@material-ui/core/CircularProgress'
import Switch from '@material-ui/core/Switch'
import { addCouponValidator } from '../../../helpers/validators'
import DeleteOutlineSharp from '@material-ui/icons/DeleteOutlineSharp'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import { BotigaCalendar } from '../../common/BotigaCalendar/BotigaCalendar'
import InputAdornment from '@material-ui/core/InputAdornment'
import {
	addCoupon,
	deleteCoupon,
	updateCoupon
} from '../../../services/profile-service'

const discountType = [
	{ key: 'Percentage', val: 'percentage' },
	{ key: 'Fixed Value', val: 'value' }
]

export function AddNewCoupon({
	coupon,
	closeAddCouponForm,
	setError,
	isAddCoupon,
	updateScreen
}) {
	const [isLoading, setIsLoading] = useState(false)

	const initialValue = {
		couponCode: coupon.couponCode,
		discountType: coupon.discountType || 'percentage',
		discountValue: coupon.discountValue,
		expiryDate: coupon.expiryDate ? coupon.expiryDate : new Date(),
		minimumOrderValue: coupon.minimumOrderValue,
		maxDiscountAmount: coupon.maxDiscountAmount,
		visibleToAllCustomers: coupon.visibleToAllCustomers || false
	}

	async function deleteExistingCoupon() {
		try {
			setIsLoading(true)
			await deleteCoupon(coupon.couponId)
			await _updateScreen(true)
		} catch (err) {
			setError(true, err)
		} finally {
			setIsLoading(false)
		}
	}

	async function _updateScreen(value) {
		try {
			updateScreen(value)
		} catch (err) {
			setError(true, err)
		}
	}

	return (
		<div className={isLoading ? 'disable-container' : 'no-css'}>
			{isLoading && (
				<div className='view-loader'>
					<CircularProgress />
				</div>
			)}
			<Formik
				enableReinitialize
				validationSchema={addCouponValidator}
				initialValues={initialValue}
				onSubmit={async values => {
					const {
						couponCode,
						discountType,
						discountValue,
						expiryDate,
						minimumOrderValue = 0,
						maxDiscountAmount = 0,
						visibleToAllCustomers = false
					} = values
					try {
						setIsLoading(true)
						if (isAddCoupon) {
							await addCoupon(
								couponCode,
								discountType,
								discountValue,
								expiryDate,
								minimumOrderValue,
								maxDiscountAmount,
								visibleToAllCustomers
							)
							await _updateScreen(true)
						} else {
							await updateCoupon(
								coupon.couponId,
								couponCode,
								discountType,
								discountValue,
								expiryDate,
								minimumOrderValue,
								maxDiscountAmount,
								visibleToAllCustomers
							)
							await _updateScreen(false)
						}
					} catch (err) {
						setError(true, err)
					} finally {
						setIsLoading(false)
					}
				}}>
				{({
					handleSubmit,
					getFieldProps,
					touched,
					errors,
					setFieldValue,
					values
				}) => (
					<form onSubmit={handleSubmit}>
						<div className='coupon-settings-body'>
							<div className='coupon-settings-row'>
								<div className='equal'>
									<TextField
										id='couponCode'
										label='Enter Coupon code'
										variant='outlined'
										fullWidth
										{...getFieldProps('couponCode')}
										error={touched.couponCode && errors.couponCode}
										helperText={errors.couponCode}
									/>
								</div>
							</div>
							<div className='coupon-settings-row'>
								<div className='equal'>
									<TextField
										disabled={!isAddCoupon}
										style={{ width: '100%' }}
										id='discountType'
										select
										variant='outlined'
										{...getFieldProps('discountType')}
										error={touched.discountType && errors.discountType}
										helperText={errors.discountType}>
										{discountType.map(el => (
											<MenuItem key={el.val} value={el.val}>
												<span className='menu-item-unit'>{el.key}</span>
											</MenuItem>
										))}
									</TextField>
								</div>
								<div className='coupon-settings-spacer' />
								<div className='equal'>
									<TextField
										InputProps={{
											endAdornment:
												values.discountType === 'percentage' ? (
													<InputAdornment position='start'>%</InputAdornment>
												) : null
										}}
										id='discountValue'
										label='Value'
										variant='outlined'
										fullWidth
										{...getFieldProps('discountValue')}
										error={touched.discountValue && errors.discountValue}
										helperText={errors.discountValue}
									/>
								</div>
							</div>
							<div className='coupon-settings-row'>
								<div className='equal'>
									<div className='no-css'>
										<div className='purchase-label'>Min. Purchase amount</div>
										<TextField
											InputProps={{
												startAdornment: (
													<InputAdornment position='start'>
														&#8377;
													</InputAdornment>
												)
											}}
											id='minimumOrderValue'
											variant='outlined'
											fullWidth
											placeholder='Ex:500'
											{...getFieldProps('minimumOrderValue')}
											error={
												touched.minimumOrderValue && errors.minimumOrderValue
											}
											helperText={errors.minimumOrderValue}
										/>
										<FormHelperText id='minPurchaseAmount'>
											Keep the value 0, if there is no min. amount
										</FormHelperText>
									</div>
								</div>
								<div className='coupon-settings-spacer' />
								<div className='equal'>
									<div className='no-css'>
										{values.discountType === 'percentage' ? (
											<React.Fragment>
												<div className='purchase-label'>
													Max. Discount value
												</div>
												<TextField
													InputProps={{
														startAdornment: (
															<InputAdornment position='start'>
																&#8377;
															</InputAdornment>
														)
													}}
													id='maxDiscountAmount'
													variant='outlined'
													fullWidth
													placeholder='Ex:500'
													{...getFieldProps('maxDiscountAmount')}
													error={
														touched.maxDiscountAmount &&
														errors.maxDiscountAmount
													}
													helperText={errors.maxDiscountAmount}
												/>
												<FormHelperText id='maxDiscountvalue'>
													Keep the value 0, to give flat discount on any value
												</FormHelperText>
											</React.Fragment>
										) : null}
									</div>
								</div>
							</div>
							<div className='coupon-settings-row'>
								<div className='equal'>
									<div className='no-css'>
										<div className='expiry-date-label'>Expiry date</div>
										<BotigaCalendar
											InputAdornmentProps={{ position: 'end' }}
											disableToolbar
											inputVariant='outlined'
											variant='inline'
											format='dd-MM-yyyy'
											id='expiry-date'
											KeyboardButtonProps={{
												'aria-label': 'select expiry date'
											}}
											{...getFieldProps('expiryDate')}
											error={touched.expiryDate && errors.expiryDate}
											helperText={errors.expiryDate}
											disablePast
											onChange={val => setFieldValue('expiryDate', val)}
											autoOk={true}
										/>
									</div>
								</div>
								<div className='coupon-settings-spacer' />
								<div className='equal'>
									<React.Fragment />
								</div>
							</div>
							<div className='coupon-settings-row'>
								<div className='coupon-visiblity-container equal'>
									<div className='coupon-visiblity-body'>
										<div className='coupon-visiblity-header-text'>
											Visible to all customers
											<div className='coupon-visiblity-subheader-text'>
												If disabled, customers cannot find the coupon in the
												coupon list, but you can still share it
											</div>
										</div>
										<Switch
											color='primary'
											id='visibleToAllCustomers'
											checked={values.visibleToAllCustomers}
											onChange={event =>
												setFieldValue(
													'visibleToAllCustomers',
													event.target.checked
												)
											}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className='coupon-settings-row-action'>
							<Button
								disabled={isAddCoupon}
								onClick={deleteExistingCoupon}
								startIcon={<DeleteOutlineSharp />}>
								Delete Coupon
							</Button>
							<div className='coupon-settings-row-action-btns'>
								<Button onClick={closeAddCouponForm}>Cancel</Button>
								<div className='coupon-settings-spacer' />
								<Button
									type='submit'
									variant='contained'
									color='primary'
									disableElevation>
									Save Coupon
								</Button>
							</div>
						</div>
					</form>
				)}
			</Formik>
		</div>
	)
}
