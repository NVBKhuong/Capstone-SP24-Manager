import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import TaskManagementContent from './TaskManagementContent'
import TaskManagementHeader from './TaskManagementHeader';
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

function TaskManagement() {

	return (<Root
	header={<TaskManagementHeader/>}
	content={
			<TaskManagementContent />
	}
/>)
}

export default TaskManagement;
