import { Avatar, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/store';
import { useEffect, useState } from 'react';
import { addMealItems, createMealItems, getFoods, selectFoods, selectMealBirdId, selectMealId, selectMealItemsDialogState, selectMeals, setMealitemsDialog } from '../store/menusSlice';
import _, { differenceBy, map } from 'lodash';

type MealItemsProp = {
    id: string
}
export default function MealItemDialog() {
    // const { id } = props
    // console.log("id",id)
    const meal: any = useAppSelector(selectMealId)
    const birdId = useAppSelector(selectMealBirdId)
    const dispatch = useAppDispatch()
    const open = useAppSelector(selectMealItemsDialogState)
    const data = useAppSelector(selectFoods)
    const [checked, setChecked] = useState([])
    const [quantities, setQuantities] = useState({});
    const [foods, setFoods] = useState([])
    const handleQuantityChange = (event, id) => {
        const newQuantity = event.target.value;
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [id]: newQuantity,
        }));
    };
    useEffect(() => {
        dispatch(getFoods())
    }, [])
    useEffect(() => {
        if (data) {
            const fd = _.filter(data, { status: "Available" })
            const existingFoodIds = map(meal.mealItems, 'food.id');
            const filteredFoods = differenceBy(fd, existingFoodIds.map(id => ({ id })), 'id');
            setFoods(filteredFoods)

        }
    }, [data, meal])

    function handleClose() {
        dispatch(setMealitemsDialog(false))
        setChecked([])
        setQuantities([])
    }
    // form handler
    function onSubmit(data) {
        data.forEach((mealItem, index) => {
            const newMealItems = {
                menuMealId: meal.id,
                foodId: mealItem.id,
                quantity: quantities[mealItem.id] > 0 ? quantities[mealItem.id] : 1,
                order: index
            }
            const mealItemData = {
                data: newMealItems,
                birdId: birdId
            }
            dispatch(createMealItems(mealItemData))
            handleClose()
        });

    }
    // List food handler
    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    }
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                component: 'form',
                onSubmit: (event) => {
                    event.preventDefault();
                    onSubmit(checked); // Pass the checked items to onSubmit Function
                }
            }}
        >
            <div className="flex justify-center">
                <DialogTitle className="font-oleoScript text-40" >Add food</DialogTitle>

            </div>
            <DialogContent>
                <List sx={{ width: '100%', backgroundColor: 'red', maxWidth: 699, bgcolor: 'background.paper' }}>
                    {foods.map((food) => {
                        const labelId = `checkbox-list-label-${food}`;

                        return (
                            <ListItem
                                className='w-512 flex items-center'
                                key={food.id}
                                disablePadding
                            >
                                <div className="flex-grow">
                                    <ListItemButton role={undefined} onClick={handleToggle(food)} dense>
                                        <ListItemIcon>
                                            <Checkbox
                                                edge="start"
                                                checked={checked.indexOf(food) !== -1}
                                                tabIndex={-1}
                                                disableRipple
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={labelId} primary={`${food.name} (${food.unitOfMeasurement.name})`} />
                                        <TextField
                                            type="number"
                                            size="small"
                                            value={quantities[food.id] || 1}
                                            onClick={(event) => event.stopPropagation()}
                                            onChange={(event) => handleQuantityChange(event, food.id)}
                                            inputProps={{ min: 1 }}
                                            className="ml-2 w-64 p-1 text-sm bg-gray-100 rounded border border-gray-300 focus:border-indigo-500"
                                        />
                                    </ListItemButton>
                                </div>
                                <ListItemAvatar className="m-2">
                                    <Avatar src={food?.thumbnailUrl} />
                                </ListItemAvatar>
                            </ListItem>
                        );
                    })}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Add</Button>
            </DialogActions>
        </Dialog>
    )
}
