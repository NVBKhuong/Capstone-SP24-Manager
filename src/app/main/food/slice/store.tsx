import { combineReducers } from '@reduxjs/toolkit';
import foodReducer from './foodSlice';
const reducer = combineReducers({
    foodReducer
})

export default reducer