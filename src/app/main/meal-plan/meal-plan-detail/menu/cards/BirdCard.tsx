import { AddCircle, AddCircleOutlineRounded, DeleteForever, RemoveCircle } from '@mui/icons-material';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, Chip, Divider } from "@mui/material";
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useAppDispatch } from 'app/store';
import { useEffect, useState } from 'react';
import CustomizedSwitches from '../../component/button/CustomizedSwitches';
import MealItemDialog from '../../dialogs/MealItemDialog';
import { addMealBirdId, addMealId, createBirdMenu, createBirdMenuMeal, removeBirdItem, setMealitemsDialog, updateBird, updateMealItem } from '../../store/menusSlice';
import { BirdType } from '../../type/MenuType';
import _ from 'lodash';
import { MenuMealType } from '../../../calendar/types/PlanType';
const ExpandMore = styled((props: any) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));
const Accordion = styled((props: any) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&::before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props: any) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));
type BirdProp = {
    bird: Partial<BirdType>
}
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
export default function BirdCard(props: BirdProp) {
    const [expanded, setExpanded] = useState(false);
    const [accordionExpend, setAccordionExpend] = useState('panel1');
    const [createdMenu, setCreatedMenu] = useState(false);
    const [sortedMenuMeal, setSortedMenuMeal] = useState<MenuMealType[]>([]);

    const dispatch = useAppDispatch()
    const { bird } = props
    const handleExpandClick = () => {
        setExpanded(!expanded);
    }
    useEffect(
        () => {
            if (bird.menu?.menuMeals.length > 0) {
                let sorted = [...bird?.menu?.menuMeals].sort((a, b) => a.from.localeCompare(b.from));
                setSortedMenuMeal(sorted);
            } else
                setSortedMenuMeal(null);
        },
        [bird.menu?.menuMeals]
    )

    useEffect(() => {
        if (bird.menu?.id) {
            if (bird.menu?.menuMeals?.length == 0 || !bird.menu?.menuMeals) {
                let promises = menuMeals.map((meal, index) => {
                    const info = {
                        menuId: bird.menu.id,
                        name: meal.name,
                        from: meal.from,
                        to: meal.to
                    }
                    const menuMealData = {
                        data: info,
                        birdId: bird.id
                    }
                    return dispatch(createBirdMenuMeal(menuMealData));
                });

                Promise.all(promises)
                    .then(() => console.log("All meals have been created"))
                    .catch((error) => console.error(error))
            }
        }
        if (createdMenu) {
            let data = new FormData();
            data.append('menuId', bird.menu?.id);
            const birdData = {
                itemId: bird.id,
                newItem: data
            }
            dispatch(updateBird(birdData))
        }
    }
        , [bird.menu?.id])
    useEffect(() => {
        if (!bird.menu?.id) {
            const data = {
                item: {
                    name: `${bird.species.name}-${bird.careMode.name} menu`
                },
                birdId: bird.id
            };
            dispatch(createBirdMenu(data))
            setCreatedMenu(true)

        }
    }
        , [])
    // bird.menu?.menuMeals.sort((a, b) => ('' + a.from).localeCompare(b.from));
    const handleChange = (panel) => (event, newExpanded) => {
        setAccordionExpend(newExpanded ? panel : false);
    };

    return (
        <Card className="shadow-lg max-w-md mx-auto overflow-hidden bg-white">
            <CardHeader
                avatar={<Avatar src={bird.thumbnailUrl} alt={bird.name} className="w-12 h-12 " />}
                title={<Typography className="text-lg font-bold truncate text-indigo-800">{bird.name}</Typography>}
                className="bg-blue-100 p-4"
          
            />
             <Divider />
            <CardContent className="flex flex-wrap gap-2 p-4 justify-center bg-blue-300">
                <Chip label={bird?.species.name} className="bg-blue-200 text-indigo-800" variant="outlined" size="small" />
                <Chip label={bird?.careMode.name} className="bg-green-200 text-green-800" variant="outlined" size="small" />
            </CardContent>
            <Divider />
            <CardActions
            className='bg-blue-100'
            disableSpacing >
                <CustomizedSwitches bird={bird} />
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent className="p-4 bg-blue-100">
                    {sortedMenuMeal && sortedMenuMeal.length > 0 ? (
                        sortedMenuMeal.map((meal, index) => (
                            <div key={index} className="mb-4 last:mb-0">
                                <Accordion className="rounded-lg shadow">
                                    <AccordionSummary className="flex justify-between items-center p-3 bg-blue-300 text-white">
                                        <Typography className="text-xl font-semibold">{meal.name}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails className="flex flex-col gap-3 p-4 bg-blue-50">
                                        {meal.mealItems.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between bg-white border border-gray-300 p-4 rounded-md shadow-sm">
                                                {/* Area1 */}
                                                <div className="flex items-center space-x-3 w-1/2">
                                                    <Avatar src={item?.food.thumbnailUrl} className="w-12 h-12 rounded-full" alt="Meal Thumbnail" />
                                                    <div className="flex flex-col min-w-0">
                                                        <Typography noWrap className="text-lg font-medium truncate text-blue-800">
                                                            {item.food.name}
                                                        </Typography>
                                                        <Typography className="text-sm text-gray-500 truncate">
                                                            {`${item.quantity} (${item.food.unitOfMeasurement.name})`}
                                                        </Typography>
                                                    </div>
                                                </div>
                                                {/* Area2 */}
                                                <div className="flex items-center space-x-3 w-1/2 justify-end">
                                                    <IconButton onClick={
                                                        () => {
                                                            dispatch(updateMealItem({
                                                                itemId: item.id,
                                                                mealId: meal.id,
                                                                birdId: bird.id,
                                                                newItem: {
                                                                    quantity: item.quantity
                                                                },
                                                                action: "decrease"
                                                            }))
                                                        }
                                                    }

                                                        className="text-red-600">
                                                        <RemoveCircle />
                                                    </IconButton>
                                                    <Typography className="text-xl font-bold">{item.quantity}</Typography>
                                                    <IconButton onClick={
                                                        () => {
                                                            dispatch(updateMealItem({
                                                                itemId: item.id,
                                                                mealId: meal.id,
                                                                birdId: bird.id,
                                                                newItem: {
                                                                    quantity: item.quantity
                                                                },
                                                                action: "increase"
                                                            }))
                                                        }
                                                    } className="text-green-600">
                                                        <AddCircle />
                                                    </IconButton>
                                                    <IconButton onClick={
                                                        () => {
                                                            dispatch(removeBirdItem({
                                                                itemId: item.id,
                                                                mealId: meal.id,
                                                                birdId: bird.id
                                                            }))
                                                        }
                                                    } className="text-red-800">
                                                        <DeleteForever />
                                                    </IconButton>
                                                </div>
                                            </div>
                                        ))}
                                    </AccordionDetails>
                                </Accordion>
                                <Button
                                    className="mt-3 w-full bg-green-400 text-white py-3 rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-500 focus:ring-opacity-50"
                                    onClick={
                                        () => {
                                            dispatch(addMealId(meal.id))
                                            dispatch(addMealBirdId(bird.id))
                                            dispatch(setMealitemsDialog(true))
                                        }
                                    }
                                >
                                    <AddCircleOutlineRounded />
                                    <span className="ml-2">Add meal item</span>
                                </Button>
                            </div>
                        ))
                    ) : (
                        <div className="flex justify-center mt-20">
                            <Typography className="text-xl font-semibold text-blue-800">No Meals Available</Typography>
                        </div>
                    )}
                </CardContent>
            </Collapse>
        </Card>
    )
}
