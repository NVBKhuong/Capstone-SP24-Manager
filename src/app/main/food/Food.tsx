import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import TabContent from './TabContent'
import TabContext from '@mui/lab/TabContext';
import { useAppSelector } from 'app/store';

import FoodHeader from './FoodHeader';
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

function Food() {
    const tabValue = useAppSelector(state => state.foodReducer.foodReducer.tabState)
	return <TabContext value={tabValue}>
	<Root
	header={<FoodHeader/>}
	content={
			<TabContent />
	}
/>
</TabContext>
}

export default Food;
