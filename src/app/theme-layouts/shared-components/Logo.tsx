import { styled } from '@mui/material/styles';

const Root = styled('div')(({ theme }) => ({
	'& > .logo-icon': {
		transition: theme.transitions.create(['width', 'height'], {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut
		})
	},
	'& > .badge': {
		transition: theme.transitions.create('opacity', {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut
		})
	}
}));

/**
 * The logo component.
 */
function Logo() {
	return (
		<Root className="flex items-center">

			<div
				className="badge  flex  items-center rounded px-8 py-4"
				style={{ backgroundColor: '#121212', color: '#61DAFB' }}
			>
				<img
					className="logo-icon h-32 w-32"
					src="assets/images/logo/bird.webp"
					alt="logo"
				/>
				<span className="react-text mx-4 text-12">Bird Farm Meal System</span>
			</div>
		</Root>
	);
}

export default Logo;
