import lazyWithReducer from 'app/store/lazyWithReducer';
import { lazy } from 'react';
import reducer from './slice/store';
const TaskManagement = lazyWithReducer('taskManagementReducer', () => import('./TaskManagement'), reducer);

const TaskManagementConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/task-management',
			element: <TaskManagement />
		}
	]
};

export default TaskManagementConfig;
