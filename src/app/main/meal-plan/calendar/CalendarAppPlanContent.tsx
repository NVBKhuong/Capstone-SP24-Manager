import { useTheme } from '@mui/material/styles';
import { useAppSelector } from 'app/store';
import _ from '@lodash';
import Box from '@mui/material/Box';
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
	const theme = useTheme();
	const labels = useAppSelector(selectLabels);

	const labelId = planInfo.event.extendedProps.label;
	const label = _.find(labels, { id: labelId });

	return (
		<Box
			sx={{
				backgroundColor: !planInfo.event._def.extendedProps.status ? "rgb(214, 62, 99)" : "rgb(65, 147, 136)",
				color: !planInfo.event._def.extendedProps.status ? "white"  : "white",
			}}
			className={clsx('items-center w-full rounded-4 px-8 py-2 h-22 ')}
		>
			{/* <Typography className="text-12 font-semibold">{planInfo.timeText}</Typography> */}
			<Typography className="text-12 px-4 truncate">{planInfo.event.title}</Typography>
		</Box>
	);
}

export default CalendarAppPlanContent;
