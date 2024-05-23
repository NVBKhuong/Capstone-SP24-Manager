import React from 'react'
import { CageType } from '../type/CageType';
import { CardActionArea, Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import Calendar from '../../calendar/Calendar';
import { useNavigate } from 'react-router';
type CardProps = {
    cage: CageType;
};
export default function CageCard(props: CardProps) {
    const { cage } = props;
    const navigate = useNavigate();
    function handleCreate() {
        navigate(`${cage.id}`)
    }
    return (
        <Card elevation={24}
            className=' '
            sx={{ maxWidth: 345 }}
        >
            <CardActionArea
                className=" hover:outline-none hover:border-sky-500 hover:ring-1 hover:ring-sky-500 "     >
                <CardMedia

                    className='object-cover h-[140px]'
                    component="img"
                    image={cage.thumbnailUrl}
                    alt={cage.name}
                />
                <CardContent >

                    <Typography gutterBottom variant="h5" >
                        {cage.name}
                    </Typography>
                    <div>
                        <Typography display="inline" className='font-bold' variant="body2" color="text.secondary">
                            Code:{" "}
                        </Typography>
                        <Typography display="inline" variant="body2" color="text.secondary">
                            {cage.code}
                        </Typography>
                    </div>
                    <div>
                        <Typography display="inline" className='font-bold' variant="body2" color="text.secondary">
                            Size:{" "}      
                        </Typography>
                        <Typography display="inline" variant="body2" color="text.secondary">
                            {cage.height} x{cage.width} x {cage.depth}
                        </Typography>
                    </div>
                </CardContent>
            </CardActionArea>
            <CardActions className='flex justify-end mr-5'>
                <Button
                    className='w-1/3'
                    variant='contained' size="small" color="secondary"
                    onClick={handleCreate}
                >
                    View Plan
                </Button>
            </CardActions>
        </Card>
    )
}
