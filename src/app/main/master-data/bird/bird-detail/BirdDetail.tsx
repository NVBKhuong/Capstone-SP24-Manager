import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import BirdDetailHeader from './BirdDetailHeader';
import { Link, useParams } from 'react-router-dom';
import BirdDetailContent from './BirdDetailContent'
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

function BirdDetail() {
    const routeParams = useParams();
	const { birdId } = routeParams;
	return (<Root
	header={<BirdDetailHeader/>}
	content={
			<BirdDetailContent id={birdId} />
	}
/>)
}

export default BirdDetail;
