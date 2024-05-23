import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { useEffect, useId, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { createMenuMeal, selectDialogState, selectMeals, selectMenuId, selectPlanById, setDialogState } from '../store/menusSlice';
import { useAppDispatch, useAppSelector } from 'app/store';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatISO } from 'date-fns';
import { MenuType, PlanType } from '../../calendar/types/PlanType';
import { showMessage } from 'app/store/fuse/messageSlice';

const schema = yup.object().shape({

  from: yup.mixed().required('Start time is required'),
  to: yup.mixed().required('End time is required'),
  mealName: yup.string().required('Name is required'),
});
export default function MealDialog({ prop }) {
  const open = useAppSelector(selectDialogState)
  const meals = useAppSelector(selectMeals)
  const plan: Partial<PlanType> = useAppSelector(selectPlanById)
  const dispatch = useAppDispatch()
  const { control, handleSubmit, formState, setError, reset, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  });
  const { errors } = formState
  function handleClose() {
    dispatch(setDialogState(false))
  }
  function formatTime(date) {
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    return timeString
  }
  function onSubmit(data) {
    const newMeal = { ...data }
    const isTimeConflict = meals.some(
      meal =>
        (meal.from <= newMeal.from && meal.to > newMeal.from) ||
        (meal.from < newMeal.to && meal.to >= newMeal.to) ||
        (newMeal.from <= meal.from && newMeal.to > meal.from) ||
        (newMeal.from < meal.to && newMeal.to >= meal.to)
    );

    if (isTimeConflict) {
      setError("from", {
        type: 'manual',
        message: "time conflict"
      });
    } else {
      const data = {
        menuId: plan.menu.id,
        name: newMeal.mealName,
        from: formatTime(newMeal.from),
        to: formatTime(newMeal.to)
      }
      const msg ={
        variant: 'success',
        autoHideDuration: 2000, 
        message: `Add meal ${newMeal.mealName} successfully`
      }
      dispatch(createMenuMeal(data));
      dispatch(showMessage(msg))
      handleClose()

    }
  }
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit(onSubmit)

      }}
    >
      <div className="flex justify-center">
        <DialogTitle className="font-oleoScript text-40" >New Meal</DialogTitle>

      </div>
      <DialogContent>

        <Typography variant='h4' className=" text-20 font-400   "> Meal name
        </Typography>
        <Controller
          name="mealName"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <>
              <TextField
                {...field}
                className="mt-8 mb-16 w-[300px] "
                required
                label="Meal name"
                variant="outlined"
                error={!!errors.mealName}
                helperText={errors?.mealName?.message as string}
              />
            </>
          )}
        />
        <Typography variant='h4' className=" text-20 font-400  my-10 "> From
        </Typography>
        <Controller
          name="from"
          defaultValue={null}
          control={control}
          render={({ field }) => (
            <TimePicker
              {...field}
              className='my-10'
            />

          )}
        />
        <Typography className=" text-red-600"> {errors?.from?.message}
        </Typography>
        <Typography variant='h4' className=" text-20 font-400   "> To
        </Typography>
        <Controller
          name="to"
          defaultValue={null}
          control={control}
          render={({ field }) => (
            <TimePicker
              {...field}
              className='my-10'

            />

          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">Add</Button>
      </DialogActions>
    </Dialog>
  )
}
