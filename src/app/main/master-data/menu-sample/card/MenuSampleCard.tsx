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
import { menuMealSampleType, menuSampleType } from 'src/app/main/meal-plan/meal-plan-detail/type/MenuType';
import { addMealId, addMenuId, removeMenuItem, setMealitemsDialog, updateMealItem } from '../store/menuSamplesSlice';

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
type MenuSampleProp = {
    menuSample: Partial<menuSampleType>
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
export default function MenuSampleCard(props: MenuSampleProp) {
    const [expanded, setExpanded] = useState(false);
    const [accordionExpend, setAccordionExpend] = useState('panel1');
    const [createdMenu, setCreatedMenu] = useState(false);
    const [sortedMenuMeal, setSortedMenuMeal] = useState<menuMealSampleType[]>([]);

    const dispatch = useAppDispatch()
    const { menuSample } = props
    const handleExpandClick = () => {
        setExpanded(!expanded);
    }
    useEffect(
        () => {
            if (menuSample?.menuMealSamples.length > 0) {
                let sorted = [...menuSample?.menuMealSamples].sort((a, b) => a.from.localeCompare(b.from));
                setSortedMenuMeal(sorted);
            } else
                setSortedMenuMeal(null);
        },
        [menuSample.menuMealSamples]
    )


    const handleChange = (panel) => (event, newExpanded) => {
        setAccordionExpend(newExpanded ? panel : false);
    };

    return (
        <Card
            className="shadow max-w-[345px]  "
        >
            <CardHeader
                avatar={
                    (<Avatar src={menuSample?.species.thumbnailUrl  } />
                    )
                }
                action={
                    <IconButton >
                    </IconButton>
                }
                title={menuSample?.name}
            />
            <Divider variant='inset' />
            <CardContent className="h-52 flex items-center">
                <Chip
                    label={menuSample?.species.name} variant='filled'>
                </Chip>
                <Chip label={menuSample?.careMode.name} variant='filled'
                >
                </Chip>
            </CardContent>
            <Divider variant='inset' />
            <CardActions disableSpacing >
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    {(sortedMenuMeal && sortedMenuMeal?.length > 0) ? (
                        sortedMenuMeal.map(
                            (meal, index) => {
                                return (
                                    <Accordion
                                        key={index}
                                    // expanded={accordionExpend == `${index}`} onChange={handleChange(index)}
                                    >
                                        <AccordionSummary>
                                            <Typography>{meal.name} </Typography>
                                        </AccordionSummary>
                                        {meal?.mealItemSamples?.map((item) => {
                                            return (
                                                <AccordionDetails key={item.id} className="flex items-center border border-solid rounded-sm shadow-sm justify-between md:flex-row -mx-8 px-16 ">

                                                    <Typography> {item?.food.name} {" ("}{item?.food.unitOfMeasurement.name}{") "}</Typography>
                                                    <div className="flex items-center">
                                                        <div className="flex items-center justify-end">     <Button
                                                            className="cursor-pointer "
                                                            onClick={
                                                                () => {
                                                                    dispatch(updateMealItem({
                                                                        itemId: item.id,
                                                                        mealId: meal.id,
                                                                        menuId: menuSample.id,
                                                                        newItem: {
                                                                            quantity: item.quantity
                                                                        },
                                                                        action: "decrease"
                                                                    }))
                                                                }
                                                            }><RemoveCircle
                                                                className="cursor-pointer "
                                                            /></Button>
                                                            <Typography className="mx-1">
                                                                {item?.quantity}
                                                            </Typography>
                                                            <Button
                                                                className="cursor-pointer"
                                                                onClick={
                                                                    () => {
                                                                        dispatch(updateMealItem({
                                                                            itemId: item.id,
                                                                            mealId: meal.id,
                                                                            menuId: menuSample.id,
                                                                            newItem: {
                                                                                quantity: item.quantity
                                                                            },
                                                                            action: "increase"
                                                                        }))
                                                                    }
                                                                }
                                                            ><AddCircle /></Button></div>
                                                        <Button
                                                            className="cursor-pointer"
                                                            onClick={
                                                                () => {
                                                                    dispatch(removeMenuItem({
                                                                        itemId: item.id,
                                                                        mealId: meal.id,
                                                                        menuId: menuSample.id
                                                                    }))
                                                                }
                                                            }
                                                        ><DeleteForever /></Button>
                                                    </div>
                                                </AccordionDetails>
                                            )
                                        }
                                        )}


                                        <Button
                                            onClick={() => {
                                                dispatch(addMealId(meal.id))
                                                dispatch(addMenuId(menuSample.id))
                                                dispatch(setMealitemsDialog(true))
                                            }}
                                        ><AddCircleOutlineRounded /></Button>
                                    </Accordion>
                                )
                            }
                        )

                    ) :
                        <div className="flex justify-center m-20 "
                        >   <Typography> </Typography></div>
                    }

                </CardContent>
            </Collapse>
        </Card>
    )
}
