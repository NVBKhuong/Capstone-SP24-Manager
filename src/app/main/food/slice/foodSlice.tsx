import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getFoods, updateFood, getFoodReport} from "src/app/auth/services/api/callAPI";

export const getFoodData = createAsyncThunk('foodReducer/getFoods', async (object: Object) => {
	try {
	  const response = await getFoods(object);
	  return response;
	} catch (error) {
	  console.log(error);
	}
  });
export const getFoodReportData = createAsyncThunk('foodReducer/getFoodReports', async (object: Object) => {
	try {
	  const response = await getFoodReport(object);
	  return response;
	} catch (error) {
	  console.log(error);
	}
  });
export const editFood = createAsyncThunk('foodReducer/editFood', async ({id, formData}: {id: string, formData: FormData}) => {
	try {
	  await updateFood(id, formData);
	} catch (error) {
	  console.log(error);
	}
  });
const foodSlice = createSlice({
	name: 'foodReducer',
	initialState: {
		searchText:'',
		tabState: '1',
        foods: {
			pagination:{
				"pageNumber": 0,
				"pageSize": 8,
				"totalRow": 0
			},
			data: []
		},
        foodReports: {
			pagination:{
				"pageNumber": 0,
				"pageSize": 8,
				"totalRow": 0
			},
			data: []
		},
    },
	reducers: {
		setSearchText: (state,action)=>{
            state.searchText = action.payload as string
        },
		setTabState: (state, action)=>{
			state.tabState = action.payload
		},
		setPaginPageNumber: (state, action) => {
			state.foods.pagination.pageNumber = action.payload as number
		},
		setPaginPageSize: (state, action) => {
			state.foods.pagination.pageSize = action.payload as number
		},
		setPaginTotalRow: (state, action) => {
			state.foods.pagination.totalRow = action.payload as number
		},
		setPaginPageNumberReport: (state, action) => {
			state.foodReports.pagination.pageNumber = action.payload as number
		},
		setPaginPageSizeReport: (state, action) => {
			state.foodReports.pagination.pageSize = action.payload as number
		},
		setPaginTotalRowReport: (state, action) => {
			state.foodReports.pagination.totalRow = action.payload as number
		},
	},
	extraReducers: (builder) => {
		builder
            .addCase(getFoodData.fulfilled, (state, action: any) => {
                state.foods = action.payload;
            })
            .addCase(getFoodReportData.fulfilled, (state, action: any) => {
                state.foodReports = action.payload;
            })
            .addCase(editFood.fulfilled, (state, action: any) => {})
	}
});

export const {setSearchText,setPaginPageNumber,setPaginPageSize,setPaginTotalRow,
	setPaginPageNumberReport,setPaginPageSizeReport
	,setPaginTotalRowReport,setTabState} = foodSlice.actions
const foodReducer = foodSlice.reducer;
export default foodReducer
