/**
 * Selected Event Type
 */
export type SelectedPlanType = {
	id: string;
	title: string;
	allDay: boolean;
	start: string;
	end: string;
	extendedProps: { desc?: string; label?: string };
};
