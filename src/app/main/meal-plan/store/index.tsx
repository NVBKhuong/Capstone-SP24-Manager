import { combineReducers } from '@reduxjs/toolkit';
// import widgets from './widgetsSlice';
import cages from './cagesSlice'
import plans from '../calendar/store/plansSlice';
import labels from '../calendar/store/labelsSlice';
import menus from '../meal-plan-detail/store/menusSlice'

/**
 * The Finance dashboard reducer.
 */
const reducer = combineReducers({
	cages,
	plans,
	labels,
	menus
});

export default reducer;
