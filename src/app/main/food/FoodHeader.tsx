import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useAppSelector,useAppDispatch } from 'app/store';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { getFoodData, getFoodReportData, setSearchText, setTabState } from './slice/foodSlice';

import { useState } from 'react';
const FoodHeader = ()=>{
    const dispatch = useAppDispatch()
    const [searchValue, setSearchValue] = useState('')
    const pageNumberReport  = useAppSelector((state) => state.foodReducer.foodReducer.foodReports.pagination.pageNumber)
    const pageSizeReport  = useAppSelector((state) => state.foodReducer.foodReducer.foodReports.pagination.pageSize)
    const pageNumber  = useAppSelector((state) => state.foodReducer.foodReducer.foods.pagination.pageNumber)
    const pageSize  = useAppSelector((state) => state.foodReducer.foodReducer.foods.pagination.pageSize)
    const handleSearch=async()=>{
        if(tabValue === "1"){
            await dispatch(getFoodData({name: searchValue, pageNumber: pageNumber, pageSize: pageSize}))
            setSearchValue('')
        }else{
            await dispatch(getFoodReportData({name: searchValue, pageNumber: pageNumberReport, pageSize: pageSizeReport}))
            setSearchValue('')
        }
    }
    const tabValue = useAppSelector(state => state.foodReducer.foodReducer.tabState)
    return <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-24 md:px-32">
        <TabList 
        value={tabValue}
        onChange={(e, newValue) => {dispatch(setTabState(newValue))}}
        >
          <Tab label="Food data" value="1"/>
          <Tab label="Food report" value="2"/>
        </TabList >
        <Stack direction='row' spacing={2}>
        <TextField  placeholder="Enter food name" label='Search foods' size="small"
                value={searchValue} onKeyPress={e => {if(e.key === 'Enter') handleSearch()}}
        onChange={e => setSearchValue(e.target.value)}
        />
          <Button
                variant="contained" className='me-12'
                color="secondary"
                startIcon={<FuseSvgIcon>heroicons-outline:search</FuseSvgIcon>}
                onClick={handleSearch}
            >
                Search
            </Button>
        </Stack>
    </div>
}
export default FoodHeader