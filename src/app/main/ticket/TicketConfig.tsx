import lazyWithReducer from 'app/store/lazyWithReducer';
import { lazy } from 'react';
import reducer from './slice/store';
const Ticket = lazyWithReducer('ticketReducer', () => import('./Ticket'), reducer);

const TicketConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/ticket',
			element: <Ticket />
		},
	]
};

export default TicketConfig;
