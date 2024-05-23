import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getTickets, updateTicket} from "src/app/auth/services/api/callAPI";

export const getTicketData = createAsyncThunk('ticketReducer/getTickets', async (object: Object) => {
	try {
	  const response = await getTickets(object);
	  return response;
	} catch (error) {
	  console.log(error);
	}
  });
export const editTicketData = createAsyncThunk('ticketReducer/editTicket', async ({id, formData}: {id: string, formData: FormData}) => {
	try {
	  await updateTicket(id, formData);
	} catch (error) {
	  console.log(error);
	}
  });

const ticketSlice = createSlice({
	name: 'ticketReducer',
	initialState: {
		searchText:'',
        tickets: {
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
		setPaginPageNumber: (state, action) => {
			state.tickets.pagination.pageNumber = action.payload as number
		},
		setPaginPageSize: (state, action) => {
			state.tickets.pagination.pageSize = action.payload as number
		},
		setPaginTotalRow: (state, action) => {
			state.tickets.pagination.totalRow = action.payload as number
		},
	},
	extraReducers: (builder) => {
		builder
            .addCase(getTicketData.fulfilled, (state, action: any) => {
                state.tickets = action.payload;
            })
            .addCase(editTicketData.fulfilled, (state, action: any) => { })
	}
});

export const {setSearchText,setPaginPageNumber,setPaginPageSize,setPaginTotalRow} = ticketSlice.actions
const ticketReducer = ticketSlice.reducer;
export default ticketReducer
