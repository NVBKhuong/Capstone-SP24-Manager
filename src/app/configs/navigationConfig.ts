import { FuseNavigationType } from '@fuse/core/FuseNavigation/types/FuseNavigationType';
import FlutterDashIcon from '@mui/icons-material/FlutterDash';
/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig: FuseNavigationType = [
	{
		id: 'apps',
		type: 'group',
		icon: 'heroicons-outline:cube',
		title: 'MODULES',
		children: [
			{
				id: 'meal-plan.Cages',
				title: 'Meal plan',
				type: 'item',
				icon: 'heroicons-outline:calendar',
				url: '/meal-plan/cages',
			},
			{
				id: 'task-overview',  
				title: 'Task overview',
				type: 'item',
				url: '/task-overview',
				icon: 'heroicons-outline:clock'
			},
			{
				id: 'task-management',  
				title: 'Task management',
				type: 'item',
				url: '/task-management',
				icon: 'heroicons-outline:view-boards'
			},
			{
				id: 'food-report',  
				title: 'Food report',
				type: 'item',
				url: '/food',
				icon: 'heroicons-outline:clipboard-list'
			},
			{
				id: 'ticket',  
				title: 'Ticket',
				type: 'item',
				url: '/ticket',
				icon: 'heroicons-outline:document-report'
			},
			{
				id: 'master-data',  
				title: 'Master data',
				type: 'collapse',
				icon: 'heroicons-solid:database',
				children:[
					{
						id: 'master-data-bird',
						title: 'Bird',
						type: 'item',
						url: 'master-data/bird',
						end: true
					},
					{
						id: 'master-data-menu-sample',
						title: 'Menu sample',
						type: 'item',
						url: 'master-data/menu-sample',
						end: true
					},
				]
			},
		]
	},

];

export default navigationConfig;
