import { ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Hidden from '@mui/material/Hidden';
import Toolbar from '@mui/material/Toolbar';
import clsx from 'clsx';
import { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectFuseCurrentLayoutConfig, selectToolbarTheme } from 'app/store/fuse/settingsSlice';
import { selectFuseNavbar } from 'app/store/fuse/navbarSlice';
import { Layout1ConfigDefaultsType } from 'app/theme-layouts/layout1/Layout1Config';
import AdjustFontSize from '../../shared-components/AdjustFontSize';
import FullScreenToggle from '../../shared-components/FullScreenToggle';
import LanguageSwitcher from '../../shared-components/LanguageSwitcher';
import NotificationPanelToggleButton from '../../shared-components/notificationPanel/NotificationPanelToggleButton';
import NavigationShortcuts from '../../shared-components/NavigationShortcuts';
import NavigationSearch from '../../shared-components/NavigationSearch';
import NavbarToggleButton from '../../shared-components/NavbarToggleButton';
import UserMenu from '../../shared-components/UserMenu';
import QuickPanelToggleButton from '../../shared-components/quickPanel/QuickPanelToggleButton';
import { Typography } from '@mui/material';
import { useAppDispatch } from 'app/store';
import { getFarms, selectFarms } from 'src/app/main/meal-plan/meal-plan-detail/store/menusSlice';
import { selectUser } from 'app/store/user/userSlice';
import { use } from 'i18next';

type ToolbarLayout1Props = {
	className?: string;
};

/**
 * The toolbar layout 1.
 */
function ToolbarLayout1(props: ToolbarLayout1Props) {
	const { className } = props;
	const config = useSelector(selectFuseCurrentLayoutConfig) as Layout1ConfigDefaultsType
	const navbar = useSelector(selectFuseNavbar)
	const farms =useSelector(selectFarms)
	const user =useSelector(selectUser)
	const [farmName,setFarmName]= useState("")
	// console.log("farms",farms)
	// console.log("users",user)
	const dispatch = useAppDispatch()
	const toolbarTheme = useSelector(selectToolbarTheme)
	useEffect(()=>{
		dispatch(getFarms())
	},[])
	useEffect(
		()=>
		{
		farms.forEach(farm => {
				if(farm.manager.email==user.data.email){
				setFarmName(farm.name)
				localStorage.setItem('farmID', farm.id)
				// console.log(farm.id)
			}
		});
		}
		,[user,farms]
	)
	return (
		<ThemeProvider theme={toolbarTheme}>
			<AppBar
				id="fuse-toolbar"
				className={clsx('relative z-20 flex shadow-md', className)}
				color="default"
				sx={{
					backgroundColor: (theme) =>
						theme.palette.mode === 'light'
							? toolbarTheme.palette.background.paper
							: toolbarTheme.palette.background.default
				}}
				position="static"
			>
				<Toolbar className="min-h-48 p-0 md:min-h-64">
					<div className="flex flex-1 px-16">
						{config.navbar.display && config.navbar.position === 'left' && (
							<>
									<Typography variant='h6'>
										{farmName}
									</Typography>
								<Hidden lgDown>
									{(config.navbar.style === 'style-3' || config.navbar.style === 'style-3-dense') && (
										<NavbarToggleButton className="mx-0 h-40 w-40 p-0" />
									)}

									{config.navbar.style === 'style-1' && !navbar.open && (
										<NavbarToggleButton className="mx-0 h-40 w-40 p-0" />
									)}
								</Hidden>

								<Hidden lgUp>
									<NavbarToggleButton className="mx-0 h-40 w-40 p-0 sm:mx-8" />
								</Hidden>
							</>
						)}

					</div>

					<div className="flex h-full items-center overflow-x-auto px-8">
						<NavigationSearch />
						{/* <AdjustFontSize />
						<FullScreenToggle />
						<QuickPanelToggleButton /> */}
						<NotificationPanelToggleButton />
						<UserMenu />
					</div>

					{config.navbar.display && config.navbar.position === 'right' && (
						<>
							<Hidden lgDown>
								{!navbar.open && <NavbarToggleButton className="mx-0 h-40 w-40 p-0" />}
							</Hidden>

							<Hidden lgUp>
								<NavbarToggleButton className="mx-0 h-40 w-40 p-0 sm:mx-8" />
							</Hidden>
						</>
					)}
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
}

export default memo(ToolbarLayout1);
