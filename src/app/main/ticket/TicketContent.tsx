import FuseScrollbars from '@fuse/core/FuseScrollbars';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import {useEffect, useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';
import { useAppDispatch,useAppSelector } from 'app/store';
import { setPaginPageNumber,setPaginPageSize } from './slice/ticketSlice';
import ViewModal from './ViewModal';
const container = {
	show: {
		transition: {
			staggerChildren: 0.1
		}
	}
};
const TicketContent = ()=>{
    const dispatch = useAppDispatch()
    const [showView, setShowView] =useState(false)
    const [viewValue, setViewValue] =useState({})
    const [openEditSuccessNotify, setOpenEditSuccessNotify] = useState(false);
    const [openEditFailNotify, setOpenEditFailNotify] = useState(false);
    const sortByPriority = (a, b) => {
      const priorityOrder = {
        'high': 3,
        'medium': 2,
        'low': 1
      };
      
      return priorityOrder[b.priority.toLowerCase()] - priorityOrder[a.priority.toLowerCase()];
    };
    const tickets = useAppSelector(state => state.ticketReducer.ticketReducer.tickets.data)
    const pageNumber  = useAppSelector((state) => state.ticketReducer.ticketReducer.tickets.pagination.pageNumber)
    const pageSize  = useAppSelector((state) => state.ticketReducer.ticketReducer.tickets.pagination.pageSize)
    const totalRow =  useAppSelector((state) => state.ticketReducer.ticketReducer.tickets.pagination.totalRow)
    const sortedTickets = tickets.slice().sort(sortByPriority);
    
    return <div className="w-full flex flex-col min-h-full bg-white">
    <FuseScrollbars className="grow overflow-x-auto">
<Table className="min-w-xl" aria-labelledby="tableTitle" >
<TableHead style={{background:'rgb(250, 251, 254)'}}>
    <TableRow>
    <TableCell align="left"><span className='font-semibold'>Type</span></TableCell>
    <TableCell align="left"><span className='font-semibold'>Problem</span></TableCell>
    <TableCell width={'15%'} align="center"><span className='font-semibold'>Priority</span></TableCell>
    <TableCell width={'15%'} align="left"><span className='font-semibold'>Created by</span></TableCell>
    <TableCell width={'15%'} align="left"><span className='font-semibold'>Created at</span></TableCell>
    <TableCell align="left"><span className='font-semibold'>Action</span></TableCell>
    </TableRow>
    </TableHead>
    {tickets && tickets.length > 0 && <TableBody>
        {sortedTickets.map((item) => (<TableRow key={item.id} >
        <TableCell align='left'>{item.ticketCategory}</TableCell>
        <TableCell align='left'>{item.title}</TableCell>
        <TableCell align='center'>{item.priority.toLowerCase() === 'low' ? <Button variant="contained" style={{pointerEvents: "none"}} color='success'>Low</Button> : item.priority.toLowerCase() === 'moderate' ? <Button style={{pointerEvents: "none"}} variant="contained" color='warning'>Moderate</Button>: <Button style={{pointerEvents: "none"}} variant="contained" color='error'>High</Button>}</TableCell>
        <TableCell align='left'>{item.creator.name}</TableCell>
        <TableCell align='left'>{new Date(item.createAt).toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })}</TableCell>
        <TableCell><Tooltip title='View detail'>
            <FuseSvgIcon className="text-48 ms-10" size={24} color="action" style={{cursor:'pointer'}} 
            onClick={()=>{setShowView(true); setViewValue(item)}}
            >heroicons-solid:eye</FuseSvgIcon>
            </Tooltip></TableCell>
    </TableRow>))}
    </TableBody>}
    </Table>
{tickets && tickets.length===0 && <Stack className='mt-36' direction='row' alignItems={"center"} justifyContent={"center"}>
<h2 style={{color:"gray"}}>No matching result</h2></Stack> }
</FuseScrollbars>
<TablePagination
className="shrink-0 border-t-1 mt-20"
component="div"
rowsPerPageOptions={[8,16,32]}
count={totalRow}
rowsPerPage={pageSize}
page={pageNumber}
backIconButtonProps={{
    'aria-label': 'Previous Page'
}}
nextIconButtonProps={{
    'aria-label': 'Next Page'
}}
onPageChange={(event, newPage) => {
   dispatch(setPaginPageNumber(newPage))
}}
onRowsPerPageChange={(event) => {
    dispatch(setPaginPageSize(parseInt(event.target.value)))
   dispatch(setPaginPageNumber(0))
    }}
/>
<Snackbar open={openEditSuccessNotify} autoHideDuration={3000} onClose={()=>{setOpenEditSuccessNotify(false)}} anchorOrigin={{vertical: 'bottom', horizontal: 'center' }}>
    <Alert onClose={()=>{setOpenEditSuccessNotify(false)}}
      severity="success" variant="filled" sx={{ width: '100%' }}>
      Edit successfully
    </Alert>
  </Snackbar>
<Snackbar open={openEditFailNotify} autoHideDuration={3000} onClose={()=>{setOpenEditFailNotify(false)}} anchorOrigin={{vertical: 'bottom', horizontal: 'center' }}>
    <Alert onClose={()=>{setOpenEditFailNotify(false)}}
      severity="error" variant="filled" sx={{ width: '100%' }}>
      Edit failed
    </Alert>
  </Snackbar>
  {showView && <ViewModal setOpenFailSnackbar={setOpenEditFailNotify} setOpenSuccessSnackbar={setOpenEditSuccessNotify} object={viewValue} show={showView} handleClose={() => setShowView(false)} />}
</div>
}
export default TicketContent