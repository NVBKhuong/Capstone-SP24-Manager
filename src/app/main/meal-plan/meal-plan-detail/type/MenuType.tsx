import { FoodType, MenuType } from "../../calendar/types/PlanType";

export type NameType = {
    id: string;
    name: string;
}
export type SpeciesType = {
    id: string
    thumbnailUrl: string
    name: string
    createAt: string
}
export type CareModeType = {
    id : string
    name : string
    priority : number 
 }
export type menuSampleType = {
    id: string;
    name: string;
    species: SpeciesType
    careMode :CareModeType
    menuMealSamples: menuMealSampleType[]
}
export type menuMealSampleType = {
    id: string;
    from: string;
    to: string;
    mealItemSamples: mealItemSamplesType[];
    name: string;

}
export type mealItemSamplesType = {
    id: string;

    quantity: number;
    food: FoodType;
    order: number;
}

export type BirdType = {
    id: string,
    code: string,
    name: string,
    dayOfBirth: Date,
    gender: string,
    characteristic: string,
    thumbnailUrl: string,
    cage: {
        id: string,
    }
    careMode?: {
        id: string,
        proirity: string,
        name: string,
        createAt: string,
    },
    species?: {
        id: string,
        thumbnailUrl: string,
        name: string,
        createAt: string,
    },
    category?: {
        thumbnailUrl: string,
        name: string,
    },
    createAt: string,
    recommend: boolean,
    menuId: string,
    menu: MenuType

}