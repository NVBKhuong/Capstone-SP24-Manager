import { useTheme } from '@mui/material/styles';
import { useAppSelector } from 'app/store';
import _ from '@lodash';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { EventContentArg } from '@fullcalendar/core';
import { selectLabels } from './store/labelsSlice';
import { PlanType } from './types/PlanType';

type CalendarAppPlanContentProps = {
	planInfo: EventContentArg & { event: PlanType };
};

/**
 * The event content for the calendar app.
 */
function CalendarAppPlanContent(props: CalendarAppPlanContentProps) {
	const { planInfo } = props;
	// console.log("planInfo",planInfo)
	const theme = useTheme();
	const labels = useAppSelector(selectLabels);

	const labelId = planInfo.event.extendedProps.label;
	const label = _.find(labels, { id: labelId });

	return (
		<Tooltip title={planInfo.event.title}>
		<Box
			sx={{
				backgroundColor: "black",
				color: "blue"
			}}
			className={clsx('items-center w-full rounded-4 px-8 py-2 h-22 text-white')}
		>
			{/* <Typography className="text-12 font-semibold">{planInfo.timeText}</Typography> */}
			<Typography className="text-12 px-4 truncate">{planInfo.event.title}</Typography>
		</Box>
			</Tooltip>
	);
}

export default CalendarAppPlanContent;
