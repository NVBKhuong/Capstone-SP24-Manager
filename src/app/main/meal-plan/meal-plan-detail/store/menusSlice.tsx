import axios from 'axios';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { RootStateType } from 'app/store/types';
import { PlanType } from '../../calendar/types/PlanType';
import { BirdType } from '../type/MenuType';


export type AppRootStateType = RootStateType<menusSliceType>;

//========== GET API ===================
export const getCareMode = createAppAsyncThunk('mealPlanReducer/menus/getCareMode', async () => {
    const response = await axios.get('/care-modes');
    const data = (await response.data);
    return data;
});
export const getSpecies = createAppAsyncThunk('mealPlanReducer/menus/getSpecies', async () => {
    const response = await axios.get('/species');
    const data = (await response.data);
    return data;
});
export const getBirds = createAppAsyncThunk('mealPlanReducer/menus/getBirds', async () => {
    const response = await axios.get('/birds');
    const data = (await response.data);
    return data;
});
export const getMenuSample = createAppAsyncThunk<any, any>('mealPlanReducer/menus/getMenuSample', async (item) => {
    const { speciesId, careModeId } = item;
    let response;
    if (speciesId == null || careModeId == null) {
        response = await axios.get('/menu-samples');
    } else {
        response = await axios.get(`/menu-samples?speciesId=${speciesId}&careModeId=${careModeId}`);
    }
    const data = (await response.data);
    return data;
});
export const getFoods = createAppAsyncThunk('mealPlanReducer/menus/getFoods', async () => {
    const response = await axios.get('/foods');
    const data = (await response.data);
    return data;
});
export const getFarms = createAppAsyncThunk('mealPlanReducer/menus/getFarms', async () => {
    const response = await axios.get('/farms');
    const data = (await response.data);
    return data;
});
export const getPlanById = createAppAsyncThunk<any, any>('mealPlanReducer/plans/getPlanById', async (planId) => {
    const response = await axios.get(`/plans/${planId}`);
    const data = (await response.data);
    return data;
});
//========== POST API ===================
export const createMenu = createAppAsyncThunk<any, any>('mealPlanReducer/menus/createMenu',
    async (dataItem) => {
        const response = await axios.post('/menus', dataItem.item);
        const data = (await response.data);
        return {
            ...data,
            actionType: dataItem.actionType
        };
    })
export const createBirdMenu = createAppAsyncThunk<any, any>('mealPlanReducer/menus/createBirdMenu',
    async (dataItem) => {
        const response = await axios.post('/menus', dataItem.item);
        const data = (await response.data);
        return {
            data: data,
            birdId: dataItem.birdId
        };
    })
export const createMenuMeal = createAppAsyncThunk<any, any>('mealPlanReducer/menus/createMenuMeal',
    async (dataItem) => {
        const response = await axios.post('/menu-meals', dataItem);
        const data = (await response.data);
        return data;
    })
export const createBirdMenuMeal = createAppAsyncThunk<any, any>('mealPlanReducer/menus/createBirdMenuMeal',
    async (dataItem) => {
        const response = await axios.post('/menu-meals', dataItem.data);
        const data = (await response.data);
        return {
            data: data,
            birdId: dataItem.birdId
        };
    })
export const createPlan = createAppAsyncThunk<any, any>('mealPlanReducer/menus/createPlan',
    async (dataItem) => {
        const response = await axios.post('/plans', dataItem);
        const data = (await response.data);
        return data;
    })
export const createMealItems = createAppAsyncThunk<any, any>('mealPlanReducer/menus/createMealItems',
    async (dataItem) => {
        const response = await axios.post('/meal-items', dataItem.data);
        const data = (await response.data);
        return {
            data: data,
            birdId: dataItem.birdId
        };
    })
export const createPFoodNormItem = createAppAsyncThunk<any, any>('mealPlanReducer/menus/createPFoodNormItem',
    async (dataItem) => {
        const response = await axios.post('/meal-items', dataItem);
        const data = (await response.data);
        return data
    })

//========== DELETE API ===================
export const removeMealItem = createAppAsyncThunk<any, any>('mealPlanReducer/menus/removeMealItem',
    async (item) => {
        const { itemId } = item;
        const response = await axios.delete(`/meal-items/${itemId}`);
        const data = (await response.data);
        return data;
    });
export const removeBirdItem = createAppAsyncThunk<any, any>('mealPlanReducer/menus/removeBirdItem',
    async (item) => {
        const { itemId } = item;
        const response = await axios.delete(`/meal-items/${itemId}`);
        const data = (await response.data);
        return data;
    });
export const removeMenuMeal = createAppAsyncThunk<any, any>('mealPlanReducer/menus/removeMenuMeal',
    async (id) => {
        const response = await axios.delete(`/menu-meals/${id}`);
        const data = (await response.data);
        return data;
    });
//========== PUT API ===================
export const updateMealItem = createAppAsyncThunk<any, any>('mealPlanReducer/plans/updateMealItem',
    async (item) => {
        const { itemId, newItem, action } = item
        if (action == "decrease") {
            if (newItem.quantity > 1) {
                newItem.quantity -= 1
                const response = await axios.put(`/meal-items/${itemId}`, newItem);
                const data = (await response.data);
                return data
            }

        }
        if (action == "increase") {
            newItem.quantity += 1
            const response = await axios.put(`/meal-items/${itemId}`, newItem);
            const data = (await response.data);
            return data;
        }
        throw new Error('No action taken');
    });
export const updateBird = createAppAsyncThunk<any, any>('mealPlanReducer/plans/updateBird',
    async (item) => {
        const { itemId, newItem } = item
        const response = await axios.put(`/birds/${itemId}`, newItem);
        const data = (await response.data);
        return data;
    });
export const updatePlan = createAppAsyncThunk<any, any>('mealPlanReducer/plans/updatePlan',
    async (item) => {
        const { itemId, newItem } = item
        const response = await axios.put(`/plans/${itemId}`, newItem);
        const data = (await response.data);
        return data;
    });



const menusAdapter = createEntityAdapter({});

export const { selectAll: selectCages, selectById: selectCageByid } = menusAdapter.getSelectors(
    (state: AppRootStateType) => state.mealPlanReducer.menus

);

const initialState = menusAdapter.getInitialState({
    searchText: '',
    birds: [] as BirdType[],
    species: [],
    careMode: [],
    menuSample: [],
    farms: [],
    mealDialog: {
        data: [],
        isOpen: false,
    },
    mealItemDialogState: {
        mealId: "",
        birdId: "",
        isOpen: false,
        foods: [],
        mealItems: [],
    },
    menuDialogState: {
        isOpen: false,
    },
    menus: {},
    plans: {} as PlanType
});


export const menusSlice = createSlice({
    name: 'mealPlanReducer/menus',
    initialState,
    reducers: {
        setSearchText: (state, action) => {
            state.searchText = action.payload as string;
        },
        setDialogState: (state, action) => {
            state.mealDialog.isOpen = action.payload
        },
        setMealitemsDialog: (state, action) => {
            state.mealItemDialogState.isOpen = action.payload
        },
        setMenuDialog: (state, action) => {
            state.menuDialogState.isOpen = action.payload
        },
        addMealItems(state, action) {
            const { mealId, mealItems } = action.payload;
            const existingMeal = state.mealDialog.data.find(meal => meal.id === mealId);

            if (existingMeal) {
                if (!existingMeal.hasOwnProperty('mealItems')) {
                    existingMeal.mealItems = [];
                }
                mealItems.forEach(newItem => {
                    if (!existingMeal.mealItems.some(existingItem => existingItem.id === newItem.id)) {
                        existingMeal.mealItems.push(newItem);
                    }

                })
            }
        },
        addMealId: (state, action) => {
            state.mealItemDialogState.mealId = action.payload
        },
        addMealBirdId: (state, action) => {
            state.mealItemDialogState.birdId = action.payload
        },
        resetPlan: () => initialState,
        setBirdRecommend: (state, action) => {
            const bird = state.birds?.find(bird => bird?.id == action.payload.birdId)
            if (bird) {
                bird.recommend = action.payload.checked
            }
        },


    },
    extraReducers: (builder) => {
        builder
            //=================== GET Reducer ========================
            .addCase(getSpecies.fulfilled, (state, action) => {
                state.species = action.payload.data
            })
            .addCase(getCareMode.fulfilled, (state, action) => {
                state.careMode = action.payload.data
            })
            .addCase(getBirds.fulfilled, (state, action) => {
                state.birds = action.payload.data
            })
            .addCase(getFoods.fulfilled, (state, action) => {
                state.mealItemDialogState.foods = action.payload.data
            })
            .addCase(getPlanById.fulfilled, (state, action) => {
                state.plans = action.payload
            })
            .addCase(getMenuSample.fulfilled, (state, action) => {
                state.menuSample = action.payload.data
            })
            .addCase(getFarms.fulfilled, (state, action) => {
                state.farms = action.payload.data
            })
            //=================== POST Reducer ========================
            .addCase(createMenu.fulfilled, (state, action) => {
                if (action.payload.actionType == "PLAN_MENU")
                    state.menus = action.payload
            })
            .addCase(createPlan.fulfilled, (state, action) => {
                state.plans = action.payload
            })
            .addCase(createBirdMenu.fulfilled, (state, action) => {
                const data = state.birds.find(bird => bird.id == action.payload.birdId)
                data.menu = action.payload.data
            })
            .addCase(createBirdMenuMeal.fulfilled, (state, action) => {
                const data = state.birds.find(bird => bird.id == action.payload.birdId)
                if (!data?.menu?.menuMeals.find(meal => meal.id === action.payload.data.id))
                    data?.menu?.menuMeals.push(action.payload.data)
            })
            .addCase(createMenuMeal.fulfilled, (state, action) => {
                if (!state.plans?.menu?.menuMeals.find(meal => meal.id === action.payload.id))
                    state.plans?.menu?.menuMeals.push(action.payload)
            })
            .addCase(createMealItems.fulfilled, (state, action) => {
                const data = state.birds.find(bird => bird.id == action.payload.birdId)
                const menuMeal = data?.menu?.menuMeals.find(meal => meal?.id == action.meta.arg.data.menuMealId)
                menuMeal.mealItems.push(action.payload.data)
            })
            .addCase(createPFoodNormItem.fulfilled, (state, action) => {
                const menuMeal = state?.plans?.menu?.menuMeals.find(meal => meal?.id == action.meta.arg.menuMealId)
                menuMeal.mealItems.push(action.payload)
            })
            //=================== DELETE Reducer ========================
            .addCase(removeMealItem.fulfilled, (state, action) => {
                const data = state.plans?.menu?.menuMeals.find(meal => meal?.id == action.meta.arg.mealId)

                const index = data.mealItems.findIndex(item => item.id === action.meta.arg.itemId)
                if (index !== -1) {
                    data.mealItems.splice(index, 1)
                }
            })
            .addCase(removeBirdItem.fulfilled, (state, action) => {
                const bird = state.birds.find(bird => bird.id == action.meta.arg.birdId)
                const meal = bird.menu?.menuMeals.find(meal => meal?.id == action.meta.arg.mealId)
                const index = meal.mealItems.findIndex(item => item.id === action.meta.arg.itemId)
                if (index !== -1) {
                    meal.mealItems.splice(index, 1)
                }
            })
            .addCase(removeMenuMeal.fulfilled, (state, action) => {
                const index = state.plans?.menu?.menuMeals.findIndex(meal => meal?.id == action.meta.arg)

                if (index !== -1) {
                    state.plans?.menu?.menuMeals.splice(index, 1)
                }
            })
            //=================== PUT Reducer ========================
            .addCase(updateMealItem.fulfilled, (state, action) => {
                if (action.meta.arg.action == "decrease") {
                    const bird = state.birds?.find(bird => bird?.id == action.meta.arg.birdId)
                    const meal = bird.menu?.menuMeals.find(meal => meal?.id == action.meta.arg.mealId)
                    const item = meal.mealItems.find(item => item.id == action.meta.arg.itemId)
                    if (item) {
                        item.quantity -= 1;
                    }
                }
                if (action.meta.arg.action == "increase") {
                    if (action.meta.arg.newItem.quantity > 1) {
                        const bird = state.birds?.find(bird => bird?.id == action.meta.arg.birdId)
                        const meal = bird.menu?.menuMeals.find(meal => meal?.id == action.meta.arg.mealId)
                        const item = meal.mealItems.find(item => item.id == action.meta.arg.itemId)
                        if (item) {
                            item.quantity += 1;
                        }
                    }
                }
            })
            .addCase(updateBird.fulfilled, (state, action) => {

            })
            .addCase(updatePlan.fulfilled, (state, action) => {

            })





    }
});

export const { setBirdRecommend, addMealBirdId, resetPlan, addMealId, setDialogState, setMealitemsDialog, setMenuDialog, addMealItems } = menusSlice.actions;

export const selectCageSearchText = (state: AppRootStateType) => state.mealPlanReducer?.menus
export const selectBirds = (state: AppRootStateType) => state.mealPlanReducer.menus.birds
export const selectSpecies = (state) => state.mealPlanReducer?.menus.species;
export const selectCareModes = (state) => state.mealPlanReducer?.menus.careMode;
export const selectMeals = (state: AppRootStateType) => state.mealPlanReducer?.menus.mealDialog.data
export const selectFarms = (state: AppRootStateType) => state.mealPlanReducer?.menus.farms
export const selectFoods = (state: AppRootStateType) => state.mealPlanReducer?.menus.mealItemDialogState.foods
export const selectMenuId = (state: AppRootStateType) => state.mealPlanReducer?.menus.menus
export const selectPlanById = (state: AppRootStateType) => state.mealPlanReducer?.menus.plans
export const selectDialogState = (state: AppRootStateType) => state.mealPlanReducer?.menus.mealDialog.isOpen
export const selectMealItemsDialogState = (state: AppRootStateType) => state.mealPlanReducer?.menus.mealItemDialogState.isOpen
export const selectMealItemsDialogProp = (state: AppRootStateType) => state.mealPlanReducer?.menus.mealItemDialogState.mealItems
export const selectMealId = (state: AppRootStateType) => state.mealPlanReducer?.menus.mealItemDialogState.mealId
export const selectMealBirdId = (state: AppRootStateType) => state.mealPlanReducer?.menus.mealItemDialogState.birdId
export const selectMenuDialogState = (state: AppRootStateType) => state.mealPlanReducer?.menus.menuDialogState.isOpen
export const selectMenuSample = (state: AppRootStateType) => state.mealPlanReducer?.menus.menuSample
export type menusSliceType = typeof menusSlice
export default menusSlice.reducer;
