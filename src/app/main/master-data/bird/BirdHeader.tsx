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
import { setPaginPageNumber, setSearchText, setArea, setCage } from './slice/birdSlice';
import { Link } from 'react-router-dom';
import instance from 'src/app/auth/services/api/customAxios';
 function BirdHeader(){
    const dispatch = useAppDispatch()
    const searchValue  = useAppSelector((state) => state.birdReducer.birdSlice.searchText)
    const areaValue = useAppSelector(state =>  state.birdReducer.birdSlice.area)
    const cageValue = useAppSelector(state =>  state.birdReducer.birdSlice.cage)
    const [areaOptions, setAreaOptions] = useState([{label: 'All', value:''}])
    const [cageOptions, setCageOptions] = useState([{label: 'All', value:''}])
    const loadData = async()=>{
        try{
            const res1 = await instance.get('/cages',{pageSize:100, pageNumber:0})
            const res2 = await instance.get('/areas',{pageSize:100, pageNumber:0})
            if (res1.data && res2.data) {
                // Update cageOptions
                const newCageOptions = res1.data.map(item => ({ label: item.name, value: item.id }));
                setCageOptions(prevOptions => [...prevOptions, ...newCageOptions]);
    
                // Update areaOptions
                const newAreaOptions = res2.data.map(item => ({ label: item.name, value: item.id }));
                setAreaOptions(prevOptions => [...prevOptions, ...newAreaOptions]);
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
    <Autocomplete size='small' 
             value={areaValue}
        onChange={(event: any, newValue) => {
            dispatch(setArea(newValue))
        }} disableClearable
        options={areaOptions}
        sx={{ width: '15rem' }}
        renderInput={(params) => <TextField  sx={{background:'white'}} {...params} label="Area" />}
      />
    <Autocomplete size='small' 
             value={cageValue}
        onChange={(event: any, newValue) => {
          dispatch(setCage(newValue));
        }} disableClearable
        options={cageOptions}
        sx={{ width: '15rem' }}
        renderInput={(params) => <TextField  sx={{background:'white'}} {...params} label="Cage" />}
      />
    
    <Paper
            component={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
            className="flex items-center w-full sm:max-w-256 space-x-8 px-16 rounded-full border-1 shadow-0"
        >
            <Input
                placeholder="Search areas"
                disableUnderline
                fullWidth
                value={searchValue}
                inputProps={{
                    'aria-label': 'Search'
                }}
                onChange={e => dispatch(setSearchText(e.target.value))}
            />

        </Paper>
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
        >
            <Button
                variant="contained" className='me-12'
                color="secondary"
                startIcon={<FuseSvgIcon>heroicons-outline:search</FuseSvgIcon>}
                //onClick={()=>{handleSearch();setSearchValue('')}}
            >
                Search
            </Button>
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