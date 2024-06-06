import { motion } from 'framer-motion';
import Paper from '@mui/material/Paper';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useState,useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'app/store';
import { setSearchText, setCage } from './slice/birdSlice';
import { Link } from 'react-router-dom';
import instance from 'src/app/auth/services/api/customAxios';
 function BirdHeader(){
    const dispatch = useAppDispatch()
    const searchValue  = useAppSelector((state) => state.birdReducer.birdSlice.searchText)
    const cageValue = useAppSelector(state =>  state.birdReducer.birdSlice.cage)
    // const [areaOptions, setAreaOptions] = useState([{label: 'All', value:''}])
    const [cageOptions, setCageOptions] = useState([])
    const loadData = async()=>{
        try{
            const res1 = await instance.get('/cages',{params:{pageSize:100, pageNumber:0, farmId: localStorage.getItem('farmID')}})
            // const res2 = await instance.get('/areas',{pageSize:100, pageNumber:0})
            if (res1.data) {
                // Update cageOptions
                console.log(res1.data)
                const newCageOptions = res1.data.map(item => ({ label: item.name, value: item.id }));
                dispatch(setCage({label: res1.data[0].name, value: res1.data[0].id}))
                setCageOptions(prevOptions => [...prevOptions, ...newCageOptions]);
    
                // Update areaOptions
                // const newAreaOptions = res2.data.map(item => ({ label: item.name, value: item.id }));
                // setAreaOptions(prevOptions => [...prevOptions, ...newAreaOptions]);
            }
        }catch(error){console.log(error)}
    }
    useEffect(()=>{
        loadData()
    },[])
    return( <div style={{background:'rgb(241, 245, 249)'}} className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-24 md:px-32">
    <motion.span
        initial={{ x: -20 }}
        animate={{ x: 0, transition: { delay: 0.2 } }}
    >
        <Typography className="text-24 md:text-32 font-extrabold tracking-tight">Birds</Typography>
    </motion.span>
    <div className="flex flex-col w-full sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">
    {/* <Autocomplete size='small' 
             value={areaValue}
        onChange={(event: any, newValue) => {
            dispatch(setArea(newValue))
        }} disableClearable
        options={areaOptions}
        sx={{ width: '15rem' }}
        renderInput={(params) => <TextField  sx={{background:'white'}} {...params} label="Area" />}
      /> */}
    <Autocomplete size='small' 
             value={cageValue}
        onChange={(event: any, newValue) => {
          dispatch(setCage(newValue));
        }} disableClearable
        options={cageOptions}
        sx={{ width: '20rem' }}
        renderInput={(params) => <TextField  sx={{background:'white'}} {...params} label="Cage" />}
      />
    
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
        >
            <Button to={`/master-data/bird/add-bird`} component={Link} variant="contained" color="secondary"
                startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
            >
                Add
            </Button>
        </motion.div>
</div>
</div>
)
}
export default BirdHeader