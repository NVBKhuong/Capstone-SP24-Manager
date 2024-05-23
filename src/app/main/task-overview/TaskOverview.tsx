import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import TaskOverviewContent from './TaskOverviewContent'
import TaskOverviewHeader from './TaskOverviewHeader';
const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider
	},
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

function TaskOverview() {

	return (<Root
	header={<TaskOverviewHeader/>}
	content={
			<TaskOverviewContent />
	}
/>)
}

export default TaskOverview;
