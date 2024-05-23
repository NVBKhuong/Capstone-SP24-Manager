import { useAppDispatch, useAppSelector } from 'app/store'
import React, { useEffect } from 'react'
import { createPFoodNormItem, getBirds, removeMealItem, removeMenuMeal, selectBirds, selectPlanById, setMenuDialog } from '../store/menusSlice'
import BirdCard from './cards/BirdCard'
import { BirdType } from '../type/MenuType'
import { Button } from '@mui/material'
import { forEach } from 'lodash'
import { menuMeals } from '../tabs/FoodNormTab'
import { MealItemType } from '../../calendar/types/PlanType'
import MenuDialog from '../dialogs/MenuDialog'
import { showMessage } from 'app/store/fuse/messageSlice'
const meals = [
    {
        name: "Morning",
        from: "07:00:00",
        to: "09:00:00"
    },
    {
        name: "Lunch",
        from: "12:0:00",
        to: "14:00:00"
    },
    {
        name: "Afternoon",
        from: "17:00:00",
        to: "19:00:00"
    },
    {
        name: "Evening",
        from: "21:00:00",
        to: "22:00:00"
    }
]
export default function BirdMenus() {
    const dispatch = useAppDispatch()
    const plan = useAppSelector(selectPlanById)
    const cageId = plan?.cage?.id;
    const birds = useAppSelector(selectBirds)
    const birdList: Partial<BirdType>[] = birds.filter(bird => bird.cage.id === cageId);

    useEffect(
        () => {
            dispatch(getBirds())
        }
        , []
    )
    let morning: MealItemType[] = []
    let lunch: MealItemType[] = []
    let evening: MealItemType[] = []
    let afternoon: MealItemType[] = []
    async function handleAplyTomenu() {

        birdList.forEach(bird => {
            if (bird.recommend === true) {
                bird?.menu?.menuMeals.forEach(
                    menuMeal => {
                        menuMeal.mealItems.forEach(mealItem => {
                            switch (menuMeal.name) {
                                case "Morning":
                                    morning.push(mealItem)
                                    break;
                                case "Lunch":
                                    lunch.push(mealItem)
                                    break;
                                case "Afternoon":
                                    afternoon.push(mealItem)
                                    break;
                                case "Evening":
                                    evening.push(mealItem)
                                    break;
                            }
                        });
                    }
                )
            }
        });
        const menuMeals = plan.menu?.menuMeals
        for (let meal of menuMeals) {
            if (meal.mealItems.length > 0) {
                for (let item of meal.mealItems) {
                    const data = {
                        itemId: item.id,
                        mealId: meal.id
                    }
                    await dispatch(removeMealItem(data))
                }
            }
        }
        const morningMeal = menuMeals.find(meal => meal.name == "Morning")
        const lunchMeal = menuMeals.find(meal => meal.name == "Lunch")
        const EveningMeal = menuMeals.find(meal => meal.name == "Evening")
        const afternoonMeal = menuMeals.find(meal => meal.name == "Afternoon")
        for (let mealItem of groupByFoodId(morning)) {
            const itemData = {
                menuMealId: morningMeal.id,
                foodId: mealItem.food.id,
                quantity: mealItem.quantity,
                order: mealItem.order
            }
            dispatch(createPFoodNormItem(itemData))

        }
        for (let mealItem of groupByFoodId(lunch)) {

            const itemData = {
                menuMealId: lunchMeal.id,
                foodId: mealItem.food.id,
                quantity: mealItem.quantity,
                order: mealItem.order
            }
            dispatch(createPFoodNormItem(itemData))

        }
        for (let mealItem of groupByFoodId(evening)) {
            const itemData = {
                menuMealId: EveningMeal.id,
                foodId: mealItem.food.id,
                quantity: mealItem.quantity,
                order: mealItem.order
            }
            dispatch(createPFoodNormItem(itemData))

        }
        for (let mealItem of groupByFoodId(afternoon)) {
            const itemData = {
                menuMealId: afternoonMeal.id,
                foodId: mealItem.food.id,
                quantity: mealItem.quantity,
                order: mealItem.order
            }
            dispatch(createPFoodNormItem(itemData))

        }
        const msg = {
            variant: 'success',
            autoHideDuration: 2000,
            message: `Apply menu successfully`,
        }
        dispatch(showMessage(msg))


    }
    function groupByFoodId(mealItems: MealItemType[]) {
        const grouped = mealItems.reduce((acc, item) => {
            const foodId = item.food.id;
            if (!acc[foodId]) {
                // Nếu chưa có foodId trong accumulator, thì tạo mới
                acc[foodId] = { ...item };
            } else {
                // Nếu đã có foodId trong accumulator, thì cộng dồn số lượng
                acc[foodId].quantity += item.quantity;
            }
            return acc;
        }, {});
        const list: MealItemType[] = Object.values(grouped)
        // Chuyển từ đối tượng thành mảng
        return list;
    }

    return (
        <div className="">
            <div className="flex items-center">
                <h4
                    className=" text-20 font-400   "
                >
                    Bird Menu
                </h4>

                <Button
                    className="mx-20"
                    onClick={() => {
                        dispatch(setMenuDialog(true))
                    }}
                    variant='contained'
                    color='secondary'
                > Auto generate menu  </Button></div>
            <MenuDialog birds={birdList} />
            <div className="grid grid-cols-3 gap-32 mt-32">
                {birdList?.map((bird) => (
                    <div key={bird.id}>
                        <BirdCard bird={bird} />
                    </div>
                ))}
            </div>
            <div className="flex  justify-end ">
                <Button
                    className='mt-32'
                    onClick={handleAplyTomenu}
                    variant='contained'
                    color='secondary'
                >
                    Apply to menu
                </Button>
            </div>
        </div>
    )
}
