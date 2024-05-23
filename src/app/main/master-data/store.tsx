import { combineReducers } from '@reduxjs/toolkit';
import birdSlice from './bird/slice/birdSlice';
import menuSamples from './menu-sample/store/menuSamplesSlice';
const reducer = combineReducers({
    birdSlice,
    menuSamples
})

export default reducer