// import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
// import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
// import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
// import { RootStateType } from 'app/store/types';
// import axios from 'axios';
// import formatISO from 'date-fns/formatISO';
// import { DeepPartial } from 'react-hook-form';
// import { PlanType } from '../types/PlanType';
// import { selectSelectedLabels } from './labelsSlice';

// // format slice type
// type AppRootStateType = RootStateType<plansSliceType>;


// /**
//  * Get Plans from server
//  */
// export const getPlans = createAppAsyncThunk('mealPlanReducer/plans/getPlans', async () => {
// 	const response = await axios.get('/plans');

// 	const data = (await response.data);
// 	console.log('>>>> data ', data)
// 	return data;
// });


// export const updatePlan = createAppAsyncThunk<PlanType, PlanType>(
// 	'mealPlanReducer/plans/updatePlan',
// 	async (Plan) => {
// 		const response = await axios.put(`/api/calendar/Plans/${Plan.id}`, Plan);

// 		const data = (await response.data) as PlanType;

// 		return data;
// 	}
// );

// /**
//  * Remove event
//  */
// export const removePlan = createAppAsyncThunk<string, string>('mealPlanReducer/plans/removeEvent', async (eventId) => {
// 	const response = await axios.delete(`/api/calendar/Plans/${eventId}`);

// 	const data = (await response.data) as string;

// 	return data;
// });

// const plansAdapter = createEntityAdapter<PlanType>();

// export type PlanDialogType = {
// 	type: 'new' | 'edit';
// 	props: {
// 		open: boolean;
// 		anchorPosition?: { top: number; left: number };
// 	};
// 	data?: DeepPartial<PlanType> | null;
// };

// const initialState = plansAdapter.getInitialState<{ planDialog: PlanDialogType }>({
// 	planDialog: {
// 		type: 'new',
// 		props: {
// 			open: false,
// 			anchorPosition: { top: 200, left: 400 }
// 		},
// 		data: null
// 	}
// });

// export const {
// 	selectAll: selectPlans,
// 	selectIds: selectPlanIds,
// 	selectById: selectPlanById
// } = plansAdapter.getSelectors((state: AppRootStateType) => state.mealPlanReducer.plans);

// /**
//  * The Calendar App Plans slice.
//  */
// export const PlansSlice = createSlice({
// 	name: 'mealPlanReducer/plans',
// 	initialState,
// 	reducers: {
// 		openNewPlanDialog: {
// 			prepare: (selectInfo: Partial<DateSelectArg>) => {
// 				const { start, end, jsEvent } = selectInfo;
// 				const payload: PlanDialogType = {
// 					type: 'new',
// 					props: {
// 						open: true,
// 						anchorPosition: { top: jsEvent.pageY, left: jsEvent.pageX }
// 					},
// 					data: {
// 						from: formatISO(start),
// 						to: formatISO(end)
// 					}
// 				};
// 				return { payload, meta: undefined, error: null };
// 			},
// 			reducer: (state, action) => {
// 				state.planDialog = action.payload as PlanDialogType;
// 			}
// 		},
// 		openEditPlanDialog: {
// 			prepare: (clickInfo: EventClickArg) => {
// 				const { jsEvent, event } = clickInfo;
// 				const { id, start, end } = event;

// 				const payload: PlanDialogType = {
// 					type: 'edit',
// 					props: {
// 						open: true,
// 						anchorPosition: { top: jsEvent.pageY, left: jsEvent.pageX }
// 					},
// 					data: {
// 						id,
// 						from: formatISO(start),
// 						to: formatISO(end)
// 					}
// 				};
// 				return { payload, meta: undefined, error: null };
// 			},
// 			reducer: (state, action) => {
// 				state.planDialog = action.payload as PlanDialogType;
// 			}
// 		},
// 		closeNewPlanDialog: (state) => {
// 			state.planDialog = {
// 				type: 'new',
// 				props: {
// 					open: false,
// 					anchorPosition: { top: 200, left: 400 }
// 				},
// 				data: null
// 			};
// 		},
// 		closeEditPlanDialog: (state) => {
// 			state.planDialog = {
// 				type: 'edit',
// 				props: {
// 					open: false,
// 					anchorPosition: { top: 200, left: 400 }
// 				},
// 				data: null
// 			};
// 		}
// 	},
// 	extraReducers: (builder) => {
// 		builder
// 			.addCase(getPlans.fulfilled, (state, action) => plansAdapter.setAll(state, action.payload.data)	)
// 			.addCase(addPlan.fulfilled, (state, action) => plansAdapter.addOne(state, action.payload))
// 			.addCase(updatePlan.fulfilled, (state, action) => plansAdapter.upsertOne(state, action.payload))
// 			.addCase(removePlan.fulfilled, (state, action) => plansAdapter.removeOne(state, action.payload));
// 	}
// });

// export const { openNewPlanDialog, closeNewPlanDialog, openEditPlanDialog, closeEditPlanDialog } =
// 	PlansSlice.actions;


// export const selectPlanDialog = (state: AppRootStateType) => state.mealPlanReducer.plans.planDialog;

// export type plansSliceType = typeof PlansSlice;

// export default PlansSlice.reducer;
