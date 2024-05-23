import { useAppDispatch, useAppSelector } from 'app/store';
import { setMenuDialog, selectMenuDialogState, createMenu, selectMenuSample, removeBirdItem, createMealItems } from '../store/menusSlice';
import { useRef, useState } from 'react';
import { showMessage } from 'app/store/fuse/messageSlice';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, MenuItem, Select } from '@mui/material';

export default function MenuDialog(props) {
    const { birds } = props
    const dispatch = useAppDispatch()
    const open = useAppSelector(selectMenuDialogState)
    const menuSamples = useAppSelector(selectMenuSample)
    // console.log(menuSamples.filter(menu => menu.name == "High quality"))
    const [menuType, setMenuType] = useState("");
    let mornigId
    let lunchId
    let afternoonId
    let eveningId
    const handleChange = (event) => {
        setMenuType(event.target.value);
    }
    function handleClose() {
        dispatch(setMenuDialog(false))
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                component: 'form',
                onSubmit: (event) => {
                    event.preventDefault();
                    async function handleMealItems() {
                        for (let bird of birds) {
                            for (let menu of menuSamples) {
                                if (bird.species.id == menu.species.id && bird.careMode.id == menu.careMode.id
                                    && menu.name == menuType
                                ) {
                                    mornigId = bird.menu.menuMeals.find(meal => meal.name == "Morning")
                                    lunchId = bird.menu.menuMeals.find(meal => meal.name == "Lunch")
                                    afternoonId = bird.menu.menuMeals.find(meal => meal.name == "Afternoon")
                                    eveningId = bird.menu.menuMeals.find(meal => meal.name == "Evening")
                                    for (let birdMeal of bird.menu.menuMeals) {
                                        for (let birdItem of birdMeal.mealItems) {
                                            await dispatch(removeBirdItem({
                                                itemId: birdItem.id,
                                                mealId: birdMeal.id,
                                                birdId: bird.id
                                            }))
                                        }
                                    }
                                    for (let meal of menu.menuMealSamples) {
                                        switch (meal.name) {
                                            // create meal Item for morning
                                            case "Morning":
                                                if (meal.mealItemSamples && meal.mealItemSamples.length > 0)
                                                    for (let index = 0; index < meal.mealItemSamples.length; index++) {
                                                        const newMealItems = {
                                                            menuMealId: mornigId.id,
                                                            foodId: meal.mealItemSamples[index].food.id,
                                                            quantity: meal.mealItemSamples[index].quantity,
                                                            order: index
                                                        }
                                                        const mealItemData = {
                                                            data: newMealItems,
                                                            birdId: bird.id
                                                        }
                                                        await dispatch(createMealItems(mealItemData))
                                                    }
                                                break;
                                            case "Lunch":
                                                if (meal.mealItemSamples && meal.mealItemSamples.length > 0)
                                                    for (let index = 0; index < meal.mealItemSamples.length; index++) {
                                                        const newMealItems = {
                                                            menuMealId: lunchId.id,
                                                            foodId: meal.mealItemSamples[index].food.id,
                                                            quantity: meal.mealItemSamples[index].quantity,
                                                            order: index
                                                        }
                                                        const mealItemData = {
                                                            data: newMealItems,
                                                            birdId: bird.id
                                                        }
                                                        await dispatch(createMealItems(mealItemData))
                                                    }
                                                break;
                                            case "Afternoon":
                                                if (meal.mealItemSamples && meal.mealItemSamples.length > 0)
                                                    for (let index = 0; index < meal.mealItemSamples.length; index++) {
                                                        const newMealItems = {
                                                            menuMealId: afternoonId.id,
                                                            foodId: meal.mealItemSamples[index].food.id,
                                                            quantity: meal.mealItemSamples[index].quantity,
                                                            order: index
                                                        }
                                                        const mealItemData = {
                                                            data: newMealItems,
                                                            birdId: bird.id
                                                        }
                                                        await dispatch(createMealItems(mealItemData))
                                                    }
                                                break;
                                            case "Evening":
                                                if (meal.mealItemSamples && meal.mealItemSamples.length > 0)
                                                    for (let index = 0; index < meal.mealItemSamples.length; index++) {
                                                        const newMealItems = {
                                                            menuMealId: eveningId.id,
                                                            foodId: meal.mealItemSamples[index].food.id,
                                                            quantity: meal.mealItemSamples[index].quantity,
                                                            order: index
                                                        }
                                                        const mealItemData = {
                                                            data: newMealItems,
                                                            birdId: bird.id
                                                        }
                                                        await dispatch(createMealItems(mealItemData))
                                                    }
                                                break;
                                        }
                                    }


                                }
                            }
                        }
                    }
                    handleMealItems()
                    const msg = {
                        variant: 'success',
                        autoHideDuration: 2000,
                        message: `Add menu successfully`,
                    }
                    handleClose()
                    dispatch(showMessage(msg))

                }
            }}
        >
            <div className="flex justify-center">
                <DialogTitle className="font-oleoScript text-40" >Menu sample </DialogTitle>
            </div>
            <DialogContent>
                <InputLabel id="demo-simple-select-label">Type of menu</InputLabel>
                <Select
                    required
                    value={menuType}
                    onChange={handleChange}
                    className='w-[200px]'
                >
                    <MenuItem value={"Low quality"}>Low quality</MenuItem>
                    <MenuItem value={"High quality"}>High quality</MenuItem>
                </Select>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Add</Button>
            </DialogActions>
        </Dialog >
    )
}
