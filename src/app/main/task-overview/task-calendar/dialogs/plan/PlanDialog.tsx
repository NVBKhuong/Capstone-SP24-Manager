import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseUtils from '@fuse/utils/FuseUtils';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from '@lodash';
import { Autocomplete, Popover } from '@mui/material';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useAppDispatch, useAppSelector } from 'app/store';
import { MouseEvent, useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import EventLabelSelect, { EventLabelSelectProps } from '../../EventLabelSelect';
import PlanModel from '../../models/PlanModel';
import { selectFirstLabelId } from '../../store/labelsSlice';
import {
	addPlan,
	closeEditPlanDialog,
	closeNewPlanDialog,
	removePlan,
	selectPlanDialog,
	updatePlan
} from '../../store/plansSlice';
import { PlanType } from '../../types/PlanType';

const defaultValues = PlanModel();

/**
 * Form Validation Schema
 */

const schema = yup.object().shape({
	from: yup.string().required('Please enter start date'),
	to: yup.string(),
	title: yup.string().required('Please enter start date'),
});

/**
 * The event dialog.
 */
function PlanDialog() {
	const dispatch = useAppDispatch();
	const planDialog = useAppSelector(selectPlanDialog);
	const firstLabelId = useAppSelector(selectFirstLabelId);
	console.log("planDialog",planDialog)
	const { reset, formState, watch, control, getValues } = useForm({
		//	defaultValues,
		mode: 'onChange',
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const start = watch('from');
	const end = watch('to');

	/**
	 * Initialize Dialog with Data
	 */
	const initDialog = useCallback(() => {
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
	function onSubmit(ev: MouseEvent<HTMLButtonElement>) {
		ev.preventDefault();
		const data = getValues();

		if (planDialog.type === 'new') {
			dispatch(addPlan(data));
		} else {
			// dispatch(updatePlan({ ...planDialog.data, ...data }));
		}
		closeComposeDialog();
	}

	/**
	 * Remove Event
	 */
	function handleRemove() {
	//	dispatch(removePlan(id));
		closeComposeDialog();
	}

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
												variant: 'outlined'
											}
										}}
										maxDate={end}
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
												variant: 'outlined'
											}
										}}
										minDate={start}
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
							>

							</TextField>
						)}
					/>

				</div>

				<div className="flex sm:space-x-24 mb-16">
					<FuseSvgIcon
						className="hidden sm:inline-flex mt-16"
						color="action"
					>
						heroicons-outline:menu-alt-2
					</FuseSvgIcon>
					{/* {mealSample && <Controller
                    name="menu"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <Autocomplete
                            className="mt-8 mb-16"
                            options={speciesList}
                            getOptionLabel={(options) => {
                                return options.name || '';
                            }
                            }
                            value={value}
                            onChange={(event, newValue) => {
                                onChange(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    className="w-[300px] ml-48"
                                    placeholder="Select one"
                                    label="Species"
                                    variant="outlined"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            )}
                        />
                    )}
                />} */}


				</div>

				{planDialog.type === 'new' ? (
					<div className="flex items-center space-x-8">
						<div className="flex flex-1" />
						<Button
							variant="contained"
							color="primary"
							onClick={onSubmit}
							disabled={_.isEmpty(dirtyFields) || !isValid}
						>
							Add
						</Button>
					</div>
				) : (
					<div className="flex items-center space-x-8">
						<div className="flex flex-1" />
						<IconButton
							onClick={handleRemove}
							size="large"
						>
							<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
						</IconButton>
						<Button
							variant="contained"
							color="primary"
							onClick={onSubmit}
							disabled={_.isEmpty(dirtyFields) || !isValid}
						>
							Save
						</Button>
					</div>
				)}
			</div>
		</Popover>
	);
}

export default PlanDialog;
