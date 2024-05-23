import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getBirds, updateBird, createBird } from "src/app/auth/services/api/callAPI";
export const getBirdData = createAsyncThunk('birdReducer/getBirds', async (object: Object) => {
	try {
		const response = await getBirds(object);
		return response;
	} catch (error) {
		console.log(error);
	}
});
//edit
export const editBird = createAsyncThunk('birdReducer/editBird', async (object: { id: string, formData: FormData }) => {
	try {
		const response = await updateBird(object.id, object.formData);
		return response;
	} catch (error) {
		console.log(error);
	}
});
// add 
export const addBird = createAsyncThunk('birdReducer/addBird', async (formData: FormData) => {
	try {
		const response = await createBird(formData);
		return response;
	} catch (error) {
		console.log(error);
	}
});
export const createMealItems = createAsyncThunk<any, any>('birdReducer/createMealItems',
	async (dataItem) => {
		const response = await axios.post('/meal-items', dataItem.data);
		const data = (await response.data);
		return {
			data: data,
			birdId: dataItem.birdId
		};
	});
// delete
const birdSlice = createSlice({
	name: 'birdReducer',
	initialState: {
		searchText:'',
		area: {label: 'All', value:''},
		cage: {label: 'All', value:''},
        birds: {
			pagination:{
				"pageNumber": 0,
				"pageSize": 8,
				"totalRow": 0
			},
			data: []
		},
		mealItemDialog: {
			mealId: "",
			birdId: "",
			isOpen: false
		},
	},
	reducers: {
		setSearchText: (state,action)=>{
            state.searchText = action.payload as string
        },
		setArea: (state, action) =>{state.area = action.payload},
		setCage: (state, action) =>{state.cage = action.payload},
		setPaginPageNumber: (state, action) => {
			state.birds.pagination.pageNumber = action.payload as number
		},
		setPaginPageSize: (state, action) => {
			state.birds.pagination.pageSize = action.payload as number
		},
		setPaginTotalRow: (state, action) => {
			state.birds.pagination.totalRow = action.payload as number
		},
		setMealitemsDialog: (state, action) => {
			state.mealItemDialog.isOpen = action.payload
		},
		setBirdId: (state, action) => {
			state.mealItemDialog.birdId = action.payload
		},
		setMealId: (state, action) => {
			state.mealItemDialog.mealId = action.payload
		},

	},
	extraReducers: (builder) => {
		builder
			.addCase(getBirdData.fulfilled, (state, action: any) => {
				state.birds = action.payload;
			})
			.addCase(editBird.fulfilled, (state, action: any) => { })
			.addCase(addBird.fulfilled, (state, action: any) => { })
			.addCase(createMealItems.fulfilled, (state, action) => {
                const data = state.birds.data.find(bird => bird.id == action.payload.birdId)
                const menuMeal = data?.menu?.menuMeals.find(meal => meal?.id == action.meta.arg.data.menuMealId)
                menuMeal.mealItems.push(action.payload.data)
            })
	}
});

export const {setSearchText,setArea, setCage, setBirdId, setMealId, setMealitemsDialog,setPaginPageNumber,setPaginPageSize,setPaginTotalRow} = birdSlice.actions
export const selectMealItemsDialog = (state) => state.birdReducer?.birdSlice.mealItemDialog.isOpen
export const selectBirdId = (state) => state.birdReducer?.birdSlice.mealItemDialog.birdId
export const selectMealId = (state) => state.birdReducer?.birdSlice.mealItemDialog.mealId

const birdReducer = birdSlice.reducer;
export default birdReducer
