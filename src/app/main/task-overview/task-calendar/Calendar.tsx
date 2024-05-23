import {
	DateSelectArg,
	DatesSetArg,
	EventAddArg,
	EventChangeArg,
	EventClickArg,
	EventContentArg,
	EventDropArg,
	EventRemoveArg
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from 'app/store';
import { useEffect, useRef, useState } from 'react';
import CalendarAppEventContent from './CalendarAppPlanContent';
import CalendarAppSidebar from './CalendarAppSidebar';
import PlanDialog from './dialogs/plan/PlanDialog';
import LabelsDialog from './dialogs/labels/LabelsDialog';
import { getLabels } from './store/labelsSlice';
import {
	getPlans,
	openEditPlanDialog,
	openNewPlanDialog,
	selectPlans,
	updatePlan
} from './store/plansSlice';
import { PlanType } from './types/PlanType';
import CalendarAppPlanContent from './CalendarAppPlanContent';
import { Tooltip } from '@mui/material';
import { withStyles } from '@mui/styles';
import { Navigate, useNavigate, useParams } from 'react-router';
import CalendarHeader from './CalendarHeader';
import { getTaskData, selectTasks } from '../../task-management/slice/taskManagementSlice';
import { getTask } from 'src/app/auth/services/api/callAPI';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& a': {
		color: `${theme.palette.text.primary}!important`,
		textDecoration: 'none!important'
	},
	'&  .fc-media-screen': {
		minHeight: '100%',
		width: '100%'
	},
	'& .fc-scrollgrid, & .fc-theme-standard td, & .fc-theme-standard th': {
		borderColor: `${theme.palette.divider}!important`
	},
	'&  .fc-scrollgrid-section > td': {
		border: 0
	},
	'& .fc-daygrid-day': {
		'&:last-child': {
			borderRight: 0
		}
	},
	'& .fc-col-header-cell': {
		borderWidth: '0 1px 0 1px',
		padding: '8px 0 0 0',
		'& .fc-col-header-cell-cushion': {
			color: theme.palette.text.secondary,
			fontWeight: 500,
			fontSize: 12,
			textTransform: 'uppercase'
		}
	},
	'& .fc-view ': {
		'& > .fc-scrollgrid': {
			border: 0
		}
	},
	'& .fc-daygrid-day.fc-day-today': {
		backgroundColor: 'transparent!important',
		'& .fc-daygrid-day-number': {
			borderRadius: '100%',
			backgroundColor: `blue!important`,
			color: `${theme.palette.secondary.contrastText}!important`,
			display: 'flex!important',
			alignItems: 'center!important',
			justifyContent: 'center!important'
		}
	},
	'& .fc-daygrid-day-top': {
		justifyContent: 'center',

		'& .fc-daygrid-day-number': {
			color: theme.palette.text.secondary,
			fontWeight: 500,
			fontSize: 12,
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			width: 26,
			height: 26,
			margin: '4px 0',
			borderRadius: '50%',
			float: 'none',
			lineHeight: 1
		}
	},
	'& .fc-h-event': {
		background: 'initial'
	},
	'& .fc-event': {
		border: 0,
		padding: '0 ',
		fontSize: 12,
		margin: '0 6px 4px 6px!important'
	}
}));

/**
 * The calendar app.
 */
function Calendar() {
	const [currentDate, setCurrentDate] = useState<DatesSetArg>();
	const dispatch = useAppDispatch();
	const tasks = useAppSelector(selectTasks);
	console.log("tasks" , tasks)
	const calendarRef = useRef<FullCalendar>(null);
	const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
	const { id } = useParams();
	useEffect(() => {
		dispatch(getTaskData({staffId: id, status:'', pageSize: 100, pageNumber: 0}));
	}, [dispatch]);
	const navigate = useNavigate();

	// handle size of calendar 
	useEffect(() => {
		// Correct calendar dimentions after sidebar toggles
		setTimeout(() => {
			calendarRef.current?.getApi()?.updateSize();
		}, 300);
	}, [leftSidebarOpen]);

	const handleDateSelect = (selectInfo: DateSelectArg) => {
		dispatch(openNewPlanDialog(selectInfo));
	};

	const handleEventDrop = (eventDropInfo: EventDropArg): void => {
		const { id, start, end } = eventDropInfo.event;
		// dispatch(
		// 	updatePlan({
		// 		id,
		// 		from: start?.toISOString() ?? '',
		// 		to: end?.toISOString() ?? '',
		// 	})
		// );
	};

	const handleEventClick = (clickInfo: EventClickArg) => {
		clickInfo.jsEvent.preventDefault();
		const id = clickInfo.event._def.publicId;
		navigate(`detail/${id}`);
		// dispatch(openEditPlanDialog(clickInfo));
	};

	const handleDates = (rangeInfo: DatesSetArg) => {
		setCurrentDate(rangeInfo);
	};

	const handleEventAdd = (addInfo: EventAddArg) => {
		// eslint-disable-next-line no-console
		console.info(addInfo);

	};

	const handleEventChange = (changeInfo: EventChangeArg) => {
		// eslint-disable-next-line no-console
		console.info(changeInfo);
	};

	const handleEventRemove = (removeInfo: EventRemoveArg) => {
		// eslint-disable-next-line no-console
		console.info(removeInfo);
	};

	function handleToggleLeftSidebar() {
		setLeftSidebarOpen(!leftSidebarOpen);
	}
	const CustomTooltip = withStyles({
		tooltip: {
			backgroundColor: 'red',
			fontSize: '1rem',
		},
		arrow: {
			color: 'red',
		},
	})(Tooltip);

	function renderCellContent(cellInfo) {
		return (
			<CustomTooltip
				placement="top"
				title={`Ngay : ${cellInfo.date}`}
			>
				<div style={{ width: '100%', height: '100%' }}>{cellInfo.dayNumberText}</div>
			</CustomTooltip>
		);
	}

	return (
		<>
			<Root
				header={
					<CalendarHeader
						calendarRef={calendarRef}
						currentDate={currentDate}
					/>
				}
				content={
					<FullCalendar
						plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
						headerToolbar={false}
						initialView="dayGridMonth"
						editable
						selectable
						selectMirror
						dayMaxEvents
						weekends
						datesSet={handleDates}
						select={handleDateSelect}
						events={tasks.map(task => ({
							id: task.id,
							start: task.startAt,
							end: task.deadline,
							title: task.title,
							extendedProps: { task: task },
							eventOverlap: function (stillEvent, movingEvent) {
								return stillEvent.allDay && movingEvent.allDay;
							}
						}))}

						// eslint-disable-next-line react/no-unstable-nested-components
						eventContent={(eventInfo: EventContentArg & { event: PlanType }) => (
							<CalendarAppPlanContent planInfo={eventInfo} />
						)}
						// eventClick={handleEventClick}
						// eventAdd={handleEventAdd}
						// eventChange={handleEventChange}
						// eventRemove={handleEventRemove}
						// eventDrop={handleEventDrop}
						initialDate={new Date()}
						ref={calendarRef}
						dayCellContent={renderCellContent}

					/>

				}
				leftSidebarContent={<CalendarAppSidebar />}
				leftSidebarOpen={leftSidebarOpen}
				leftSidebarOnClose={() => setLeftSidebarOpen(false)}
				leftSidebarWidth={240}
				scroll="content"
			/>
			<PlanDialog />
			<LabelsDialog />
		</>
	);
}

export default Calendar;
