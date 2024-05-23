import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { lighten } from '@mui/material/styles';
import CardMedia from '@mui/material/CardMedia';

export default function BirdCard({birdInfo}){
    return <Card className="flex flex-col h-384 w-192 shadow">
        <CardMedia
        sx={{ height: 140 }}
        image={birdInfo.thumbnailUrl}
        title="green iguana"
      />
    <CardContent className="flex flex-col flex-auto p-12">
        <Stack direction='column' spacing={1}>
        <Typography className='text-16 font-semibold'>{birdInfo.name}</Typography>
        <Typography><b>Species:</b> {birdInfo.species.name}</Typography>
        <Typography><b>Category:</b> {birdInfo.category.name}</Typography>
        <Typography><b>Cage:</b> {birdInfo.cage.name}</Typography>
        </Stack>
    </CardContent>
    <CardActions
        className="items-center justify-end py-16 px-24"
        sx={{
            backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.03)
        }}
    >
        <Button
            to={`/master-data/bird/bird-detail/${birdInfo.id}`}
            component={Link}
            className="px-16 min-w-128"
            color="secondary"
            variant="contained"
            endIcon={<FuseSvgIcon size={20}>heroicons-solid:arrow-sm-right</FuseSvgIcon>}
        >Bird detail</Button>
    </CardActions>
    </Card>
}