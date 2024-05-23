import lazyWithReducer from 'app/store/lazyWithReducer';
import reducer from './store';
import { Navigate } from 'react-router';

import { lazy } from 'react';

const MealPlan = lazyWithReducer('mealPlanReducer', () => import('./MealPlan'), reducer);
const Calendar = lazy(() => import('./calendar/Calendar'));
const Cages = lazy(() => import('./cages/Cages'));
const MealPlanDetail = lazy(() => import('./meal-plan-detail/MealPlanDetail'));

/**
 * The MealPlan configuration.
 */
const MealPlanConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'meal-plan',
			element: <MealPlan />,
            children: [
				{
					path: '',
					element: <Navigate to="/meal-plan/cages" />
				},
				{
					path: 'cages/:cageId/',
					element: <Calendar />
				},
				{
					path: 'cages',
					element: <Cages />
				},
				{
					path: 'cages/:cageId/detail/:planId',
					element: <MealPlanDetail />
				}
			]
		}
	]
};

export default MealPlanConfig;
