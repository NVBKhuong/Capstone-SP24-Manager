import { motion } from 'framer-motion';
import Paper from '@mui/material/Paper';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useState,useEffect } from 'react';
import { useAppDispatch,useAppSelector } from 'app/store';
import { getTicketData } from './slice/ticketSlice';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const TicketHeader = ()=>{
    const dispatch = useAppDispatch()   
    const [value, setValue]=useState('Processing')
    const [type, setType]=useState('All')
    const pageNumber  = useAppSelector((state) => state.ticketReducer.ticketReducer.tickets.pagination.pageNumber)
    const pageSize  = useAppSelector((state) => state.ticketReducer.ticketReducer.tickets.pagination.pageSize)
    
    useEffect(()=>{
        dispatch(getTicketData({status: value, ticketCategory: type === 'All' ? '': type, pageNumber:0, pageSize:100}))    
    },[value,type, pageNumber, pageSize])

    return <div style={{background:'rgb(241, 245, 249)'}} className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-24 md:px-32">
    <motion.span
        initial={{ x: -20 }}
        animate={{ x: 0, transition: { delay: 0.2 } }}
    >
        <Typography className="text-24 md:text-32 font-extrabold tracking-tight">Ticket</Typography>
    </motion.span>
    <div className="flex flex-col w-full sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">
    <Stack direction ='row' spacing={2}>
    <Autocomplete size='small' 
             value={value}
        onChange={(event: any, newValue: string | null) => {
          setValue(newValue);
        }} disableClearable
        options={['Processing','Rejected','Work finished','Done']}
        sx={{ width: '15rem' }}
        renderInput={(params) => <TextField  sx={{background:'white'}} {...params} label="Status" />}
      />
    <Autocomplete size='small' 
             value={type}
        onChange={(event: any, newValue: string | null) => {
          setType(newValue);
        }} disableClearable
        options={['All','Food','Bird', 'Cage', 'Personnel']}
        sx={{ width: '15rem' }}
        renderInput={(params) => <TextField  sx={{background:'white'}} {...params} label="Type" />}
      />
    
        </Stack>
        </div>
</div>
}
export default TicketHeader