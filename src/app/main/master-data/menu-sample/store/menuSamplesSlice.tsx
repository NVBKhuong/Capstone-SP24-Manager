import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootStateType } from 'app/store/types';
import axios from 'axios';
import { DeepPartial } from 'react-hook-form';
import { menuSampleType } from 'src/app/main/meal-plan/meal-plan-detail/type/MenuType';

// format slice type
export type AppRootStateType = RootStateType<menuSamplesSliceType>;

export const dateFormat = 'YYYY-MM-DDTHH:mm:ss.sssZ';

/**
 * Get 
 */
export const getMenuSamples = createAsyncThunk<any, any>('menuSamplesReducer/menuSamples/getMenuSamples', async () => {
    const response = await axios.get(`/menu-samples`);
    const data = (await response.data);
    return data;
});


/**
 * Add 
 */
export const createMenuSample = createAsyncThunk<any, any>('menuSamplesReducer/menuSamples/createMenuSample',
    async (dataItem) => {
        const response = await axios.post('/menu-samples', dataItem);
        const data = (await response.data);
        return data
    })
export const createMenuMealSample = createAsyncThunk<any, any>('menuSamplesReducer/menuSamples/createMenuMealSample',
    async (dataItem) => {
        const response = await axios.post('/menu-meal-samples', dataItem.data);
        const data = (await response.data);
        return {
            data: data,
            menuId: dataItem.menuId
        }
    })
export const createMealItemSample = createAsyncThunk<any, any>('menuSamplesReducer/menuSamples/createMealItemSample',
    async (dataItem) => {
        const response = await axios.post('/meal-item-samples', dataItem.data);
        const data = (await response.data);
        return {
            data: data,
            menuId: dataItem.menuId
        };
    })

/**
 * Update 
 */
export const updateMealItem = createAsyncThunk<any, any>('menuSamplesReducer/menuSamples/updateMealItem',
    async (item) => {
        const { itemId, newItem, action } = item
        if (action == "decrease") {
            if (newItem.quantity > 1) {
                newItem.quantity -= 1
                const response = await axios.put(`/meal-item-samples/${itemId}`, newItem);
                const data = (await response.data);
                return data
            }
          
        }
        if (action == "increase") {
            newItem.quantity += 1
            const response = await axios.put(`/meal-item-samples/${itemId}`, newItem);
            const data = (await response.data);
            return data;
        }
        throw new Error('No action taken');
    });

/**
 * Remove 
 */
export const removeMenuItem = createAsyncThunk<any, any>('menuSamplesReducer/menuSamples/removeMenuItem',
    async (item) => {
        const { itemId } = item;
        const response = await axios.delete(`/meal-item-samples/${itemId}`);
        const data = (await response.data);
        return data;
    });
// handle set all plans, select plan
const menuSamplesAdapter = createEntityAdapter<menuSampleType>();

export type PlanDialogType = {
    type: 'new' | 'edit';
    props: {
        open: boolean;
        anchorPosition?: { top: number; left: number };
    };
    data?: DeepPartial<menuSampleType> | null;
};

const initialState = menuSamplesAdapter.getInitialState({
    menuSampleDialog: {
        isOpen: false,
    },
    menuSamples: [] as menuSampleType[],
    mealItemDialog: {
        mealId: "",
        menuId: "",
        isOpen: false,

    },
});

export const {
    selectAll: selectMenuSamples,
    // selectIds: selectPlanIds,
    // selectById: selectPlanById
} = menuSamplesAdapter.getSelectors((state: AppRootStateType) => state.menuSamplesReducer.menuSamples)

/**
 * The Calendar App Plans slice.
 * Handle Plan Dialog
 */
export const menuSamplesSlice = createSlice({
    name: 'menuSamplesReducer/menuSamples',
    initialState,
    reducers: {
        setMenuSampleDialog: (state, action) => {
            state.menuSampleDialog.isOpen = action.payload
        },
        setMealitemsDialog: (state, action) => {
            state.mealItemDialog.isOpen = action.payload
        },
        addMealId: (state, action) => {
            state.mealItemDialog.mealId = action.payload
        },
        addMenuId: (state, action) => {
            state.mealItemDialog.menuId = action.payload
        },

    },
    extraReducers: (builder) => {
        builder
            //get
            .addCase(getMenuSamples.fulfilled, (state, action) => {
                state.menuSamples = action.payload.data
            })
            //creete
            .addCase(createMenuSample.fulfilled, (state, action) => {
                state.menuSamples.push(action.payload)
            })
            .addCase(createMenuMealSample.fulfilled, (state, action) => {
                const data = state.menuSamples.find(menu => menu.id == action.payload.menuId)
                data.menuMealSamples.push(action.payload.data)
            })
            .addCase(createMealItemSample.fulfilled, (state, action) => {
                const data = state.menuSamples.find(menu => menu.id == action.payload.menuId)
                const menuMeal = data?.menuMealSamples.find(meal => meal?.id == action.meta.arg.data.menuMealSampleId)
                menuMeal.mealItemSamples.push(action.payload.data)
            })
            //update
            .addCase(updateMealItem.fulfilled, (state, action) => {
                if (action.meta.arg.action == "decrease") {
                    const menu = state.menuSamples?.find(menu => menu?.id == action.meta.arg.menuId)
                    const meal = menu?.menuMealSamples.find(meal => meal?.id == action.meta.arg.mealId)
                    const item = meal.mealItemSamples.find(item => item.id == action.meta.arg.itemId)
                    if (item) {
                        item.quantity -= 1;
                    }
                }
                if (action.meta.arg.action == "increase") {
                    if (action.meta.arg.newItem.quantity > 1) {
                        const menu = state.menuSamples?.find(menu => menu?.id == action.meta.arg.menuId)
                        const meal = menu?.menuMealSamples.find(meal => meal?.id == action.meta.arg.mealId)
                        const item = meal.mealItemSamples.find(item => item.id == action.meta.arg.itemId)
                        if (item) {
                            item.quantity += 1;
                        }
                    }
                }
            })
            //delete
            .addCase(removeMenuItem.fulfilled, (state, action) => {
                const menu = state.menuSamples.find(menu => menu.id == action.meta.arg.menuId)
                const meal = menu.menuMealSamples.find(meal => meal?.id == action.meta.arg.mealId)
                const index = meal.mealItemSamples.findIndex(item => item.id === action.meta.arg.itemId)
                if (index !== -1) {
                    meal.mealItemSamples.splice(index, 1)
                }
            })
    }
});

export const { addMealId, addMenuId, setMenuSampleDialog, setMealitemsDialog } = menuSamplesSlice.actions

export const selectMenuSampleDiaglogOpen = (state: AppRootStateType) => state.menuSamplesReducer.menuSamples.menuSampleDialog.isOpen
export const selectMenuSamplesList = (state: AppRootStateType) => state.menuSamplesReducer.menuSamples.menuSamples
export const selectMealId = (state: AppRootStateType) => state.menuSamplesReducer.menuSamples.mealItemDialog.mealId
export const selectMenuId = (state: AppRootStateType) => state.menuSamplesReducer.menuSamples.mealItemDialog.menuId
export const selectMealItemSampleDiaglogOpen = (state: AppRootStateType) => state.menuSamplesReducer.menuSamples.mealItemDialog.isOpen

export type menuSamplesSliceType = typeof menuSamplesSlice;

export default menuSamplesSlice.reducer;
