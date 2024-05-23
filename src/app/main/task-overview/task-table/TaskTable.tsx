import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import TaskTableContent from './TaskTableContent'
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

function TaskTable() {
	const routeParams = useParams();
	const { id } = routeParams;
	return (<Root
	// header={<TaskOverviewHeader/>}
	content={
			<TaskTableContent userId={id}/>
	}
/>)
}

export default TaskTable;
