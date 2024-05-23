/**
 *  Type
 */

export type PlanType = {
	id: string;
	from: string;
	to: string;
	title: string;
	createAt?: string
	cage?: CageType;
	menu?: MenuType
	// allDay?: boolean | undefined;
	// extendedProps?: {
	// 	desc?: string;
	// 	label?: string;
	// };
};
export type CageType = {
	id: string,
	code: string,
	name: string,
	material: string,
	description: string,
	height: number,
	width: number,
	depth: number,
	thumbnailUrl: string,
	caremode: {
		id: string,
		proirity: string,
		name: string,
		createAt: string,
	},
	species: {
		id: string,
		thumbnailUrl: string,
		name: string,
		createAt: string,
	},
	area: {
		id: string,
		thumbnailUrl: string,
		name: string,
		createAt: string,
	},
	createAt: string,
}
export type MenuType = {
	id: string;
	createAt?: string
	name: string;
	menuMeals: MenuMealType[]
}
export type MenuMealType = {
	id: string;
	createAt?: string
	name: string;
	from: string;
	to: string;
	mealItems: MealItemType[]
}
export type MealItemType = {
	id: string;
	order: number;
	quantity: number;
	food: FoodType
	hasChanged: boolean;
}
export type FoodType = {
	id: string;
	name: string;
	thumbnailUrl: string;
	unitOfMeasurement: UoM
}
export type UoM = {
	name: string;
}