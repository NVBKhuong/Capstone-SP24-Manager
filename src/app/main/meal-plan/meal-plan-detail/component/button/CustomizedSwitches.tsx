import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAppDispatch } from 'app/store';
import { setBirdRecommend } from '../../store/menusSlice';
import { useEffect, useState } from 'react';



const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&::before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&::after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));



export default function CustomizedSwitches(props) {
  const { bird } = props
  const [checked, setChecked] = useState(bird?.recommend ?? true)
  console.log("bird", bird?.recommend)
  const dispatch = useAppDispatch()
  useEffect(
    () => {
      const data = {
        birdId: props?.bird?.id,
        checked: true
      }
      dispatch(setBirdRecommend(data))
    }
    , []
  )
  useEffect(
    () => {
      if (bird?.recommend !== undefined)
        setChecked(bird.recommend)
    }
    , [bird?.recommend]
  )
  const handleChange = (event) => {
    const data = {
      birdId: props?.bird?.id,
      checked: !bird?.recommend
    }
    dispatch(setBirdRecommend(data))
    // console.log("bird", bird?.recommend)
  };
  return (
    <div className="flex items-center ">
      <Android12Switch
        checked={checked}
        onChange={handleChange}
      />
      <Typography className="text-indigo-800" variant="body1">Recommend</Typography>

    </div>
  );
}