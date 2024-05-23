import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import { FuseRouteConfigsType, FuseRoutesType } from '@fuse/utils/FuseUtils';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import Error404Page from '../main/404/Error404Page';
import Error404Config from '../main/404/Error404Config';
import TaskManagementConfig from '../main/task-management/TaskManagementConfig';
import TicketConfig from '../main/ticket/TicketConfig';
import MealPlanConfig from '../main/meal-plan/MealPlanConfig';
import FoodConfig from '../main/food/FoodConfig';
import BirdConfig from '../main/master-data/bird/BirdConfig';
import TaskOverviewConfig from '../main/task-overview/TaskOverviewConfig';
import MenuSampleConfig from '../main/master-data/menu-sample/MenuSampleConfig';

const routeConfigs: FuseRouteConfigsType = [
	MealPlanConfig,
	TaskManagementConfig,
	TicketConfig,BirdConfig, TaskOverviewConfig,MenuSampleConfig,
	FoodConfig,
	 SignOutConfig, 
	 SignInConfig,
	  SignUpConfig, 
	  Error404Config];

/**
 * The routes of the application.
 */
const routes: FuseRoutesType = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
	{
		path: '/',
		element: <Navigate to="/meal-plan" />,
		auth: settingsConfig.defaultAuth
	},
	{
		path: 'loading',
		element: <FuseLoading />
	},
	{
		path: '404',
		element: <Error404Page />
	},
	{
		path: '*',
		element: <Navigate to="404" />
	}
];

export default routes;
