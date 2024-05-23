import { combineReducers } from '@reduxjs/toolkit';
import ticketReducer from './ticketSlice';
const reducer = combineReducers({
    ticketReducer
})

export default reducer