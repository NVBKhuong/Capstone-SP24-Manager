import lazyWithReducer from 'app/store/lazyWithReducer';
import reducer from './slice/store';
const Food = lazyWithReducer('foodReducer', () => import('./Food'), reducer);

const FoodConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/food',
			element: <Food />
		},
	]
};

export default FoodConfig;
