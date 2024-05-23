import { motion } from 'framer-motion';
import { Checkbox, IconButton } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'app/store';
import { openLabelsDialog, selectLabels, selectSelectedLabels, toggleSelectedLabels } from './store/labelsSlice';

/**
 * The calendar app sidebar.
 */
function CalendarAppSidebar() {
	const labels = useAppSelector(selectLabels);
	const selectedLabels = useAppSelector(selectSelectedLabels);
	const dispatch = useAppDispatch();

	return (
		<div className="flex flex-col flex-auto min-h-full p-32">
			<motion.span
				initial={{ x: -20 }}
				animate={{ x: 0, transition: { delay: 0.2 } }}
				className="pb-24 text-4xl font-extrabold tracking-tight"
			>
				Food norm
			</motion.span>

			<div className="group flex items-center justify-between mb-12">
				<Typography
					className="text-15 font-600 leading-none"
					color="secondary.main"
				>
					{/* LABELS */}
				</Typography>

		
			</div>

	
		</div>
	);
}

export default CalendarAppSidebar;
