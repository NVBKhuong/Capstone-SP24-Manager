import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from '@lodash';
import { formatISO } from 'date-fns';
import { Popover, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useAppDispatch, useAppSelector } from 'app/store';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import PlanModel from '../../models/PlanModel';
import { selectFirstLabelId } from '../../store/labelsSlice';
import {
	addPlan,
	closeEditPlanDialog,
	closeNewPlanDialog,
	selectPlanDialog,
	selectPlans
} from '../../store/plansSlice';
import { selectCage } from '../../../store/cagesSlice';
import { createMenu, createMenuMeal, createPlan } from '../../../meal-plan-detail/store/menusSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import moment from 'moment';

const defaultValues = PlanModel();

/**
 * Form Validation Schema
 */
const menuMeals = [
	{
		name: "Morning",
		from: "07:00:00",
		to: "09:00:00"
	},
	{
		name: "Lunch",
		from: "12:0:00",
		to: "14:00:00"
	},
	{
		name: "Afternoon",
		from: "17:00:00",
		to: "19:00:00"
	},
	{
		name: "Evening",
		from: "21:00:00",
		to: "22:00:00"
	}
]


/**
 * The event dialog.
 */
function PlanDialog() {

	const dispatch = useAppDispatch();
	const cage = useAppSelector(selectCage)
	const plans = useAppSelector(selectPlans)
	console.log("plans", plans)
	const schema = yup.object().shape({
		from: yup.string().required('Please enter start date')
			.test('overlap', 'Your time overlaps with existing plans', function (value) {
				const { from, to } = this.parent;
				return !plans.some(plan => (
					(new Date(from) <= new Date(plan.to) && new Date(to) >= new Date(plan.from))
				));
			}),
		to: yup.string().required("Please enter end date"),
		title: yup.string().required('Please enter title'),
	})
	const planDialog = useAppSelector(selectPlanDialog);
	const firstLabelId = useAppSelector(selectFirstLabelId);
	const { reset, formState, watch, control, getValues } = useForm({
		//	defaultValues,
		mode: 'onChange',
		resolver: yupResolver(schema)
	})

	const { isValid, dirtyFields, errors } = formState;

	const [isClicked, setIsClicked] = useState(false);

	const start = watch('from');
	const end = watch('to');

	/**
	 * Initialize Dialog with Data
	 */
	const initDialog = useCallback(() => {
		setIsClicked(false); // Reset isClicked state when dialog is opened
		/**
		 * Dialog type: 'edit'
		 */
		if (planDialog.type === 'edit' && planDialog.data) {
			reset({ ...planDialog.data });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (planDialog.type === 'new') {
			reset({
				...defaultValues,
				...planDialog.data,

				//			id: FuseUtils.generateGUID()
			});
		}
	}, [planDialog.data, planDialog.type, reset]);

	/**
	 * On Dialog Open
	 */
	useEffect(() => {
		if (planDialog.props.open) {
			initDialog();
		}
	}, [planDialog.props.open, initDialog]);

	/**
	 * Close Dialog
	 */
	function closeComposeDialog() {
		return planDialog.type === 'edit' ? dispatch(closeEditPlanDialog()) : dispatch(closeNewPlanDialog());
	}

	/**
	 * Form Submit
	 */
	const onSubmit = async (ev: MouseEvent<HTMLButtonElement>) => {
		ev.preventDefault();
		setIsClicked(true)
		const data = {
			item: {
				name: `${cage.name}-${cage.code}`
			},
			actionType: "PLAN_MENU"
		};
		const menu = await dispatch(createMenu(data))
		const planData = {
			title: getValues().title,
			from: moment(getValues().from).format('YYYY-MM-DDTHH:mm:ss'),
			to: moment(getValues().to).format('YYYY-MM-DDTHH:mm:ss'),
			menuId: menu.payload.id,
			cageId: cage.id
		}
		dispatch(addPlan(planData))

		let promises = menuMeals.map((meal, index) => {
			const info = {
				menuId: menu.payload.id,
				name: meal.name,
				from: meal.from,
				to: meal.to
			}
			return dispatch(createMenuMeal(info));
		});

		Promise.all(promises)
			.then(() => {
				const msg = {
					variant: 'success',
					autoHideDuration: 2000,
					message: `Add new plan successfully`,
				}
				dispatch(showMessage(msg))
			})
			.catch((error) => console.error(error))
		closeComposeDialog()

	}

	/**
	 * Remove Event
	 */


	return (
		<Popover
			{...planDialog.props}
			open={planDialog.props.open}
			anchorReference="anchorPosition"
			anchorOrigin={{
				vertical: 'center',
				horizontal: 'right'
			}}
			transformOrigin={{
				vertical: 'center',
				horizontal: 'left'
			}}
			onClose={closeComposeDialog}
			component="form"
		>
			<div className="flex flex-col max-w-full p-24 pt-32 sm:pt-40 sm:p-32 w-480">
				<Typography variant="h5" className="flex font-semibold justify-center mb-16">New plan</Typography>

				<div className="flex sm:space-x-24 mb-16">
					<FuseSvgIcon
						className="hidden sm:inline-flex mt-16"
						color="action"
					>
						heroicons-outline:calendar
					</FuseSvgIcon>
					<div className="w-full">
						<div className="flex flex-column sm:flex-row w-full items-center space-x-16">
							<Controller
								name="from"
								control={control}
								render={({ field: { onChange, value } }) => (
									<DateTimePicker
										className="mt-8 mb-16 w-full"
										value={new Date(value)}
										onChange={onChange}
										slotProps={{
											textField: {
												label: 'Start',
												variant: 'outlined',
												error: !!errors.from,
												helperText: errors.from?.message,
											}
										}}
									/>
								)}
							/>
							<Controller
								name="to"
								control={control}
								render={({ field: { onChange, value } }) => (
									<DateTimePicker
										className="mt-8 mb-16 w-full"
										value={new Date(value)}
										onChange={onChange}
										slotProps={{
											textField: {
												label: 'End',
												variant: 'outlined',
												error: !!errors.to,
												helperText: errors.to?.message,
											}
										}}
										minDate={new Date(start)}
									/>
								)}
							/>
						</div>


					</div>
				</div>

				<div className="flex sm:space-x-24 mb-16">
					<FuseSvgIcon
						className="hidden sm:inline-flex mt-16"
						color="action"
					>
						heroicons-outline:tag
					</FuseSvgIcon>
					<Controller
						name="title"
						control={control}
						render={({ field: { onChange, value } }) => (
							<TextField
								onChange={onChange}
								value={value}
								id="title"
								label="Title"
								className="flex-auto"
								InputLabelProps={{
									shrink: true
								}}
								variant="outlined"
								autoFocus
								required
								fullWidth
								error={!!errors.title} // will be true if field has error
								helperText={errors.title && errors.title.message} // 
							>

							</TextField>
						)}
					/>

				</div>



				<div className="flex items-center space-x-8">
					<div className="flex flex-1" />
					<Button
						variant="contained"
						color="primary"
						onClick={onSubmit}
						disabled={_.isEmpty(dirtyFields) || !isValid || isClicked}
					>
						Add
					</Button>
				</div>

			</div>
		</Popover>
	);
}

export default PlanDialog;
