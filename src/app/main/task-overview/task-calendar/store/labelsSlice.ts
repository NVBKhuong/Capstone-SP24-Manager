import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import _ from '@lodash';
import { RootStateType } from 'app/store/types';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { LabelType } from '../types/LabelType';

type AppRootStateType = RootStateType<labelsSliceType>;

/**
 * Get labels from server
 */
export const getLabels = createAppAsyncThunk('mealPlanReducer/labels/getLabels', async () => {
	const response = await axios.get('/api/calendar/labels');
	const data = (await response.data) as LabelType[];

	return data;
});

/**
 * Add new label
 */
export const addLabel = createAppAsyncThunk<LabelType, LabelType>('mealPlanReducer/labels/addLabel', async (newLabel) => {
	const response = await axios.post('/api/calendar/labels', newLabel);
	const data = (await response.data) as LabelType;

	return data;
});

/**
 * Update label
 */
export const updateLabel = createAppAsyncThunk<LabelType, LabelType>(
	'mealPlanReducer/labels/updateLabel',
	async (label) => {
		const response = await axios.put(`/api/calendar/labels/${label.id}`, label);
		const data = (await response.data) as LabelType;

		return data;
	}
);

/**
 * Remove label
 */
export const removeLabel = createAppAsyncThunk<string, string>('mealPlanReducer/labels/removeLabel', async (labelId) => {
	const response = await axios.delete(`/api/calendar/labels/${labelId}`);

	const data = (await response.data) as string;

	return data;
});

const labelsAdapter = createEntityAdapter<LabelType>();

const initialState = labelsAdapter.getInitialState<{
	selectedLabels: string[];
	labelsDialogOpen: boolean;
	ids: string[];
}>({
	selectedLabels: [],
	labelsDialogOpen: false,
	ids: []
});

export const {
	selectAll: selectLabels,
	selectIds: selectLabelIds,
	selectById: selectLabelById
} = labelsAdapter.getSelectors((state: AppRootStateType) => state.mealPlanReducer.labels);

/**
 * The CalendarApp labels slice.
 */
export const labelsSlice = createSlice({
	name: 'mealPlanReducer/labels',
	initialState,
	reducers: {
		toggleSelectedLabels: (state, action) => {
			state.selectedLabels = _.xor(state.selectedLabels, [action.payload]) as string[];
		},
		openLabelsDialog: (state) => {
			state.labelsDialogOpen = true;
		},
		closeLabelsDialog: (state) => {
			state.labelsDialogOpen = false;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(getLabels.fulfilled, (state, action) => {
				labelsAdapter.setAll(state, action.payload);
				state.selectedLabels = action.payload.map((item) => item.id);
			})
			.addCase(addLabel.fulfilled, (state, action) => labelsAdapter.addOne(state, action.payload))
			.addCase(updateLabel.fulfilled, (state, action) => labelsAdapter.upsertOne(state, action.payload))
			.addCase(removeLabel.fulfilled, (state, action) => labelsAdapter.removeOne(state, action.payload));
	}
});

export const selectSelectedLabels = (state: AppRootStateType) => state.mealPlanReducer.labels?.selectedLabels;
export const selectFirstLabelId = (state: AppRootStateType) => state.mealPlanReducer.labels?.ids[0];
export const selectLabelsDialogOpen = (state: AppRootStateType) => state.mealPlanReducer.labels?.labelsDialogOpen;

export const { toggleSelectedLabels, openLabelsDialog, closeLabelsDialog } = labelsSlice.actions;

export type labelsSliceType = typeof labelsSlice;

export default labelsSlice.reducer;
