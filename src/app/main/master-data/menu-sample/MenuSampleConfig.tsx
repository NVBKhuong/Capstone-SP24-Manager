import lazyWithReducer from 'app/store/lazyWithReducer';
import reducer from '../store';
import { Navigate } from 'react-router';

import { lazy } from 'react';

const MenuSample = lazyWithReducer('menuSamplesReducer', () => import('./MenuSample'), reducer);

/**
 * The MealPlan configuration.
 */
const MenuSampleConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'master-data/menu-sample',
			element: <MenuSample />
		}
	]
};

export default MenuSampleConfig;
