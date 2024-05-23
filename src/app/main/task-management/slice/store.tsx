import { combineReducers } from '@reduxjs/toolkit';
import taskManagement from './taskManagementSlice';
const reducer = combineReducers({
    taskManagement
})

export default reducer