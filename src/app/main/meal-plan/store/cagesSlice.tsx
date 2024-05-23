import axios from 'axios';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { RootStateType } from 'app/store/types';
import { CagesType, CageType } from '../cages/type/CageType';


export type AppRootStateType = RootStateType<cagesSliceType>;

export const getCage = createAppAsyncThunk<any, any>('mealPlanReducer/cages/getCage', async (id) => {
    const response = await axios.get(`/cages/${id}`);
    const data = (await response.data);
    return data;
});
export const getCages = createAppAsyncThunk<CagesType>('mealPlanReducer/cages/getCages', async () => {
    const response = await axios.get('/cages');
    const data = (await response.data);
    return data;
});

const cagesAdapter = createEntityAdapter<CageType>({});

export const { 
    selectAll: selectCages,
    selectById: selectCageByid } =
     cagesAdapter.getSelectors(
        (state: AppRootStateType) => state.mealPlanReducer.cages
    );

const initialState = cagesAdapter.getInitialState({
    searchText: '',
    pagination: {},
    data: {}
});


export const cagesSlice = createSlice({
    name: 'mealPlanReducer/cages',
    initialState,
    reducers: {
        setSearchText: (state, action) => {
            state.searchText = action.payload as string;
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(getCages.fulfilled, (state, action) => {
                cagesAdapter.setAll(state, action.payload.data);
                state.pagination = action.payload.pagination;
                state.searchText = '';
            })
            .addCase(getCage.fulfilled, (state, action) => {
                state.data = action.payload

            })



    }
});

export const { setSearchText } = cagesSlice.actions;

export const selectCageSearchText = (state: AppRootStateType) => state.mealPlanReducer?.cages.searchText;

export const selectCage = (state) => state.mealPlanReducer?.cages.data;
export type cagesSliceType = typeof cagesSlice;
export default cagesSlice.reducer;
