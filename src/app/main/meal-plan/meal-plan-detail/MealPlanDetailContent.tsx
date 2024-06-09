import { yupResolver } from '@hookform/resolvers/yup';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Divider, Grid, Paper, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useAppDispatch, useAppSelector } from 'app/store';
import { showMessage } from 'app/store/fuse/messageSlice';
import { format, formatISO, startOfDay } from 'date-fns';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import * as yup from 'yup';
import { MenuMealType, MenuType, PlanType } from '../calendar/types/PlanType';
import { getCage, selectCage } from '../store/cagesSlice';
import MealItemDialog from './dialogs/MealItemDialog';
import BirdMenus from './menu/BirdMenus';
import { createMealItems, createMenu, createMenuMeal, createPlan, getCareMode, getMenuSample, getPlanById, getSpecies, removeMenuMeal, resetPlan, selectCareModes, selectMealItemsDialogProp, selectMeals, selectMenuId, selectMenuSample, selectPlanById, selectSpecies, updateMealItem, updatePlan } from './store/menusSlice';
import { menuSampleType } from './type/MenuType';
const schema = yup.object().shape({

    title: yup.string().trim().required("Title is required").max(200, "Maximum 200 characters"),
    start: yup.date().required('Start date is required'),
    end: yup.date().test(
        "is-greater",
        "End date must be greater than today",
        function (value) {
            const toDate = startOfDay(new Date(value));
            const today = startOfDay(new Date());

            if (value) return (formatISO(toDate, { representation: 'date' }) >= formatISO(today, { representation: 'date' }))

            return true; // bypass this test if `start` is undefined
        }
    ).required('End date is required'),

    menuName: yup.string()
})
const menuMeals = [
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
export default function MealPlanDetailContent() {
    const dispatch = useAppDispatch()
    const { cageId, planId } = useParams()
    const cage = useAppSelector(selectCage)
    const meals = useAppSelector(selectMeals)
    const specieses = useAppSelector(selectSpecies)
    const careModes = useAppSelector(selectCareModes)
    const menuSamples = useAppSelector(selectMenuSample)
    const menu: Partial<MenuType> = useAppSelector(selectMenuId)
    const plan: Partial<PlanType> = useAppSelector(selectPlanById)
    const isExistMealItem = useAppSelector(selectMealItemsDialogProp)
    // useState
    const [sortedMenuMeals, setSortedMenuMeals] = useState([]);
    const [sortedMenuMeal, setSortedMenuMeal] = useState<MenuMealType[]>([]);
    const [planCreated, setPlanCreated] = useState(false);
    const [menuCreated, setMenuCreated] = useState(false);
    const [openMealDialog, setOpenDialog] = useState(false)
    const [isMenuExist, setIsMenuExist] = useState(false)
    const [isTitleEdited, setIsTitleEdited] = useState(false)
    const [awaiRender, setAwaitrender] = useState(true)
    const [selectedMenuSample, setSelectedMenuSample] = useState<menuSampleType>();
    const [isDisabledStart, setIsDisabledStart] = useState(false);
    const [isDisabledEnd, setIsDisabledEnd] = useState(false);

    // const [isTitleEdited, setIsTitleEdited] = useState(false)
    const { control, watch, formState, handleSubmit, getValues, setError, setValue, reset } = useForm(
        {
            mode: "onChange",
            resolver: yupResolver(schema)
        }
    )
    const start = watch('start');
    const end = watch('end');
    const { errors } = formState
    const navigate = useNavigate()
    //useEffet
    //------- get List Info--------
    useEffect(
        () => {
            dispatch(getCage(cageId))
            dispatch(getSpecies())
            dispatch(getCareMode())
            dispatch(getPlanById(planId))
            const data = {
                speciesId: null,
                careModeId: null
            }
            dispatch(getMenuSample(data))
        }
        , [])

    useEffect(() => { }, [plan])
    // -------- Insert form ----------
    useEffect(() => {
        if (Object.keys(plan).length !== 0) {
            const data = {
                title: plan.title,
                start: new Date(plan.from),
                end: new Date(plan.to),
                menuName: plan.menu.name,
            }
            reset(data)
            const frDate = startOfDay(new Date(plan.from));
            const toDate = startOfDay(new Date(plan.to));
            const today = startOfDay(new Date());

            if (formatISO(toDate, { representation: 'date' }) < formatISO(today, { representation: 'date' })) {
                setIsDisabledEnd(true);
            }
            if (formatISO(frDate, { representation: 'date' }) <= formatISO(today, { representation: 'date' })) {
                setIsDisabledStart(true);
            }


        } else
            return;
    }
        , [reset, plan]
    )

    useEffect(() => {
        if (plan?.menu?.menuMeals.length > 0) {
            let sorted = [...plan?.menu?.menuMeals].sort((a, b) => a.from.localeCompare(b.from));
            setSortedMenuMeal(sorted);
        } else
            setSortedMenuMeal(null);
    }, [plan?.menu?.menuMeals]);

    // Sử dụng sortedMenuMeal trong render
    useEffect(() => {
        return () => {
            dispatch(resetPlan());
        };
    }, [dispatch])
    // Form handler
    function handleApply() {
        const menuMeals = plan.menu.menuMeals
        if (menuMeals.length > 0) {
            menuMeals.forEach(meal => {
                dispatch(removeMenuMeal(meal.id))
            });
        }
        const menuSampleList = selectedMenuSample?.menuMealSamples;
        let data
        let itemData
        const handleCreation = async (menuSampleList) => {
            if (menuSampleList.length > 0) {
                for (let index = 0; index < menuSampleList.length; index++) {
                    const mealSample = menuSampleList[index];
                    data = {
                        menuId: plan.menu.id,
                        name: mealSample.name,
                        from: mealSample.from,
                        to: mealSample.to
                    }
                    const result = await dispatch(createMenuMeal(data));
                    const newMenuMeal = result.payload; // Unwrap result from action
                    if (mealSample.mealItemSamples.length > 0) {
                        for (let item of mealSample.mealItemSamples) {
                            itemData = {
                                menuMealId: newMenuMeal.id,
                                foodId: item.food.id,
                                quantity: item.quantity,
                                order: item.order
                            }
                            await dispatch(createMealItems(itemData)).catch(error => console.log(error));
                        }
                    }

                }
            }
        }

        handleCreation(menuSampleList);

    }
    function formatDateToDayMonth(date) {
        if (date instanceof Date) {
            const formattedDate = date.toLocaleDateString('vn-VI', { day: '2-digit', month: '2-digit' });
            return formattedDate;
        }
        return null;
    }
    function onSubmit(data) {
        const menuMeals = plan.menu?.menuMeals ? plan.menu.menuMeals : null
        if (menuMeals?.length > 0) {
            menuMeals.forEach(menuMeal => {
                menuMeal.mealItems.forEach(mealItem => {
                    if (mealItem.hasChanged == true) {
                        const item = {
                            itemId: mealItem.id,
                            newItem: {
                                quantity: mealItem.quantity
                            }
                        }
                        dispatch(updateMealItem(item))
                    }

                });
            });
        }
        const msg = {
            variant: 'success',
            autoHideDuration: 2000,
            message: `Save successfully`,
        }
        dispatch(showMessage(msg))


    }
    return (<div className="flex justify-center  w-full">
        <Paper elevation={24} className='rounded-[16px] w-full m-[30px] h-auto'>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='my-[5rem] mx-40 '>

                <div className="flex">
                    <div className=' w-1/2 '>
                        <Typography display="inline-block" className="font-oleoScript text-40  border-b-2  ">  Plan info
                        </Typography>
                        {/* <span className="bg-red">
                            <span className="mx-20 border border-solid rounded-full hover:scale-125 cursor-pointer"> <EditRounded /> </span>
                        </span> */}


                        <Box display="flex " >
                            <div className='mt-10 '>
                                <Typography variant='h4' className=" text-20 font-400   "> Start
                                </Typography>
                                <Controller
                                    name="start"
                                    control={control}
                                    defaultValue={new Date()}
                                    render={({ field }) => (
                                        <DatePicker
                                            {...field}
                                            disabled={isDisabledStart}
                                            className='my-10'
                                        />

                                    )}
                                />
                            </div>
                            <div className='mt-10 mx-[3rem]'>
                                <Typography variant='h4' className=" text-20 font-400   "> To
                                </Typography>
                                <Controller
                                    name="end"
                                    control={control}
                                    defaultValue={new Date()}
                                    render={({ field }) => (
                                        <>
                                            <DatePicker
                                                minDate={new Date(start)}
                                                {...field}
                                                disabled={isDisabledEnd}
                                                className='my-10'
                                            />
                                            <Typography color="red">{errors?.end?.message}</Typography>

                                        </>
                                    )}
                                />
                            </div>
                        </Box>
                        <Box display="flex " alignItems="center">
                            <Controller
                                name="title"
                                defaultValue={plan.title ? plan.title : ""}
                                control={control}
                                render={({ field }) => <TextField
                                    {...field}
                                    className="mt-8 mb-16 w-[300px] "
                                    label="Title"
                                    variant="outlined"
                                    error={!!errors.title}
                                    helperText={errors?.title?.message as string}
                                />}

                            />
                        </Box>

                    </div>
                    <div className="w-1/2 justify-center    ">

                        {/* Cage Info */}
                        <Typography display="inline-block" className="font-oleoScript text-40  border-b-2  "> Cage info
                        </Typography>
                        <Box display="flex "  >
                            <div className='mt-10 '>
                                <Typography variant='h4' className=" text-20 font-400   "> Cage name
                                </Typography>

                                <TextField
                                    value={cage.name ? cage.name : ""}
                                    disabled
                                    autoFocus
                                    className="mt-8 mb-16 w-[300px] "
                                    variant="outlined"
                                />
                                <div
                                    className="flex justify-end">
                                    <Button
                                        onClick={async () => {
                                            const newPlan = {
                                                "title": getValues().title,
                                                "from": format(getValues().start, "yyyy-MM-dd'T'HH:mm:ss"),
                                                "to": format(getValues().end, "yyyy-MM-dd'T'HH:mm:ss")
                                            }
                                            const planData = {
                                                itemId: plan.id,
                                                newItem: newPlan
                                            }
                                            const result = await dispatch(updatePlan(planData))
                                            console.log("result ", result)
                                            let msg
                                            if (result.payload) {
                                                msg = {
                                                    variant: 'success',
                                                    autoHideDuration: 2000,
                                                    message: `Edit plan successfully`,
                                                }
                                            } else {
                                                msg = {
                                                    variant: 'error',
                                                    autoHideDuration: 2000,
                                                    message: `Cannot edit to date has plan`,
                                                }
                                            }
                                            dispatch(showMessage(msg))
                                        }}
                                        variant="contained" color="secondary">
                                        Save
                                    </Button>

                                </div>


                            </div>

                        </Box>
                    </div>
                </div>
                <Divider variant='fullWidth' flexItem />
                {/* Menu */}
                <>

                    {/* Memnu sample */}
                    <Box display="flex"  >

                        <div className='mt-10 mx-40 flex-1'>
                            <Typography className="font-oleoScript text-40 justify-center flex">Daily Menu</Typography>
                            <Typography variant='h4' className=" text-20 font-400   "> Menu: {plan?.menu?.name}
                            </Typography>
                            <MealItemDialog />

                            {(sortedMenuMeal && sortedMenuMeal?.length > 0) ? (
                                sortedMenuMeal.map((meal) => {
                                    return (
                                        <Accordion key={meal.id} className="shadow-lg rounded-lg my-8 overflow-hidden">
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                classes={{ root: 'mb-4 p-4' }}
                                            >
                                                <div className="flex flex-col">
                                                    <Typography className="font-bold text-lg">{meal.name}</Typography>
                                                    <Typography className="text-blue-500">
                                                        From: {meal.from}<br />To: {meal.to}
                                                    </Typography>
                                                </div>
                                            </AccordionSummary>
                                            {meal?.mealItems?.map((item) => (
                                                <AccordionDetails key={item.id} className="flex items-center p-4 shadow-sm border-b border-solid">
                                                    <Avatar src={item?.food.thumbnailUrl}></Avatar>
                                                    <Typography className="ml-4">
                                                        {item?.food.name} {item?.quantity} ({item?.food.unitOfMeasurement.name})
                                                    </Typography>
                                                </AccordionDetails>
                                            ))}
                                        </Accordion>
                                    );
                                })
                            ) : (
                                <div className="flex justify-center m-20">
                                    <Typography>There is no meal available!</Typography>
                                </div>
                            )}

                        </div>

                    </Box>

                </>



                <div className="">

                    <Typography display="inline-block" className="font-oleoScript text-40  border-b-2  ">  Birds in cage
                    </Typography>
                    <Typography variant='h4' className=" text-20 font-400 my-20  ">
                    </Typography>
                    <BirdMenus isDisable={isDisabledStart} />


                </div>
            </form>
        </Paper>
    </div >
    )
}
