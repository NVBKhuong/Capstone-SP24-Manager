import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCages, getTask, createTask, updateTask, assigntStaffToTask, deleteStaffToTask, updateStaffToChecklist } from "src/app/auth/services/api/callAPI";

export const getCageData = createAsyncThunk('taskReducer/getCages', async (object: Object) => {
	try {
		const response = await getCages(object);
		return response;
	} catch (error) {
		console.log(error);
	}
});
export const getTaskData = createAsyncThunk('taskReducer/getTasks', async (object:any) => {
	try {
		const response = await getTask(object);
		return response;
	} catch (error) {
		console.log(error);
	}
});
export const addTask = createAsyncThunk('taskReducer/createTask', async (object: Object) => {
	try {
		const response = await createTask(object);
		return response;
	} catch (error) {
		console.log(error);
	}
});
export const editTask = createAsyncThunk('taskReducer/updateTask', async ({ id, object }: { id: string, object: any }) => {
	try {
		const response = await updateTask(id, object);
		return response;
	} catch (error) {
		console.log(error);
	}
});
export const assignStaff = createAsyncThunk('taskReducer/assignStaff', async (object: Object) => {
	try {
		const response = await assigntStaffToTask(object);
		return response;
	} catch (error) {
		console.log(error);
	}
});
export const removeStaff = createAsyncThunk('taskReducer/removeStaff', async ({ id, staffId }: { id: string, staffId: string }) => {
	try {
		const response = await deleteStaffToTask(id, { staffId: staffId });
		return response;
	} catch (error) {
		console.log(error);
	}
});
export const updateStaffForChecklist = createAsyncThunk('taskReducer/updateStaffForChecklist', async ({ checklistId, updateInfo }: { checklistId: string, updateInfo: Object }) => {
	try {
		await updateStaffToChecklist(checklistId, updateInfo);
	} catch (error) {
		console.log(error);
	}
});
export const setTaskDataToEmpty = createAsyncThunk('taskReducer/setTaskDataToEmpty', async () => {
	return [];
});
const taskManagementSlice = createSlice({
	name: 'taskManagementReducer',
	initialState: {
		filterStatus: 'To do',
		cageList: {
			pagination: {
				"pageNumber": 0,
				"pageSize": 8,
				"totalRow": 0
			},
			data: []
		},
		taskList: {
			pagination: {
				"pageNumber": 0,
				"pageSize": 8,
				"totalRow": 0
			},
			data: []
		}
	},
	reducers: {
		setFilterStatus: (state, action) => {
			state.filterStatus = action.payload as string
		},
		setPaginPageNumber: (state, action) => {
			state.taskList.pagination.pageNumber = action.payload as number
		},
		setPaginPageSize: (state, action) => {
			state.taskList.pagination.pageSize = action.payload as number
		},
		setPaginTotalRow: (state, action) => {
			state.taskList.pagination.totalRow = action.payload as number
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getCageData.fulfilled, (state, action: any) => {
				state.cageList = action.payload;
			})
			.addCase(getTaskData.fulfilled, (state, action: any) => {
				state.taskList = action.payload;
			})
			.addCase(addTask.fulfilled, (state, action: any) => { })
			.addCase(editTask.fulfilled, (state, action: any) => { })
			.addCase(setTaskDataToEmpty.fulfilled, (state, action: any) => {
				state.taskList.data = [];
			})
			.addCase(assignStaff.fulfilled, (state, action: any) => { })
			.addCase(removeStaff.fulfilled, (state, action: any) => { })
			.addCase(updateStaffForChecklist.fulfilled, (state, action: any) => { })
	}
});
export const selectTasks = (state) => state.taskManagementReducer?.taskManagement.taskList.data

export const { setFilterStatus, setPaginPageNumber, setPaginPageSize, setPaginTotalRow } = taskManagementSlice.actions
const taskManagementReducer = taskManagementSlice.reducer;
export default taskManagementReducer
