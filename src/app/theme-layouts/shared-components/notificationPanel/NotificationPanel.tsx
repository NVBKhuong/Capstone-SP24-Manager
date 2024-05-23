import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'app/store';
import { useLocation } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import NotificationTemplate from 'app/theme-layouts/shared-components/notificationPanel/NotificationTemplate';
import NotificationModel from 'app/theme-layouts/shared-components/notificationPanel/models/NotificationModel';
import withReducer from 'app/store/withReducer';
import NotificationCard from './NotificationCard';
import { addNotification, getNotifications } from './store/dataSlice';
import { closeNotificationPanel, selectNotificationPanelState, toggleNotificationPanel } from './store/stateSlice';
import reducer from './store';
import { useSelector } from 'react-redux';

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
	'& .MuiDrawer-paper': {
		backgroundColor: theme.palette.background.default,
		width: 320
	}
}));

/**
 * The notification panel.
 */
function NotificationPanel() {
	const location = useLocation();
	const dispatch = useAppDispatch();
	const state = useSelector(selectNotificationPanelState);
	const notifications = useAppSelector(state => state.notificationPanel.data.notification.data);
	const notificationMsg = useAppSelector(state => state.notificationPanel.data.notificationMessage);

	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	useEffect(() => {
		/*
		Get Notifications from db
		 */
		dispatch(getNotifications({pageNumber: 0, pageSize:20}));
	}, [dispatch]);

	useEffect(() => {
		if (state) {
			dispatch(closeNotificationPanel());
		}
		// eslint-disable-next-line
	}, [location, dispatch]);

	function handleClose() {
		dispatch(closeNotificationPanel());
	}

	useEffect(()=>{
		notificationMsg.title !== "" && enqueueSnackbar(notificationMsg.title, {
			key: Math.random().toString(),
			autoHideDuration: 3000,
			content: (
				<NotificationTemplate
					item={notificationMsg} 
				/>
			)
		});
	},[notificationMsg])

	return (
		<StyledSwipeableDrawer
			open={state}
			anchor="right"
			onOpen={() => { }}
			onClose={() => dispatch(toggleNotificationPanel())}
			disableSwipeToOpen
		>
			<IconButton
				className="absolute right-0 top-0 z-999 m-4"
				onClick={handleClose}
				size="large"
			>
				<FuseSvgIcon color="action">heroicons-outline:x</FuseSvgIcon>
			</IconButton>
			{notifications.length > 0 ? (
				<FuseScrollbars className="p-16">
					<div className="flex flex-col">
						<div className="mb-36 flex items-end justify-between pt-36">
							<Typography className="text-28 font-semibold leading-none">Notifications</Typography>
						</div>
						{notifications.map((item) => (
							<NotificationCard
								key={item.id}
								className="mb-16"
								item={item}
							/>
						))}
					</div>
					{/* <div className="flex items-center justify-center py-16">
						<Button
							size="small"
							variant="outlined"
							onClick={demoNotification}
						>
							Create a notification example
						</Button>
					</div> */}
				</FuseScrollbars>
			) : (
				<div className="flex flex-1 items-center justify-center p-16">
					<Typography
						className="text-center text-24"
						color="text.secondary"
					>
						There are no notifications for now.
					</Typography>
				</div>
			)}
		</StyledSwipeableDrawer>
	);
}

export default withReducer('notificationPanel', reducer)(NotificationPanel);
