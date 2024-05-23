import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { NotificationModelType } from 'app/theme-layouts/shared-components/notificationPanel/models/NotificationModel';
import { RootStateType } from 'app/store/types';
import instance from 'src/app/auth/services/api/customAxios';
export type AppRootStateType = RootStateType<dataSliceType>;

/**
 * Gets the notifications from the server.
 */
export const getNotifications = createAppAsyncThunk<any, any>('notificationPanel/getData', async (params) => {
	const response = await instance.get('/notifications/managers',{params: params}).catch(err => console.log(err));
	// console.log(response)
	return response;
});

/**
 * Adds a notification.
 */
export const addNotification = createAppAsyncThunk<any,any>(
	'notificationPanel/addNotification',
	async (item) => {
		const deviceToken = localStorage.getItem('notify_device_token')
		const response = await instance.post(`/notifications/send?tokens=${deviceToken}`, {
			"title": "test",
			"body": "test",
			"link": "string",
			"type": "string"
		  });
		return response;
	}
);

const notificationsAdapter = createEntityAdapter<NotificationModelType>();

const initialState = notificationsAdapter.getInitialState();

// export const { selectAll: selectNotifications, selectById: selectNotificationsById } =
// 	notificationsAdapter.getSelectors((state: AppRootStateType) => state.notificationPanel.data);

/**
 * The notification panel slice.
 */
export const dataSlice = createSlice({
	name: 'notificationPanel/data',
	initialState: {
		searchText:'',
		notificationMessage: {
			title: "",
			message: "",
			createAt: ""
		},
        notification: {
			pagination: {
				"pageNumber": 0,
				"pageSize": 0,
				"totalRow": 0
			},
			data:[]
		},
	},
	reducers: {
		setNotificationMessage: (state,action)=>{
            state.notificationMessage = action.payload
        },
	},
	extraReducers: (builder) => {
		builder
		.addCase(getNotifications.fulfilled, (state, action) =>{
			state.notification = action.payload
		})
	}
});
export const {setNotificationMessage} = dataSlice.actions

export type dataSliceType = typeof dataSlice;

export default dataSlice.reducer;
