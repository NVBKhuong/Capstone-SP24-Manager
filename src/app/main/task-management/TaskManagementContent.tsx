import FuseScrollbars from '@fuse/core/FuseScrollbars';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';  
import Alert from '@mui/material/Alert';
import EditModal from './EditModal';
import ViewModal from './ViewModal';
import { lighten } from '@mui/material/styles';
import {useEffect, useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';
import { useAppDispatch,useAppSelector } from 'app/store';
import { getTaskData,setPaginPageNumber, setPaginPageSize, setTaskDataToEmpty  } from './slice/taskManagementSlice';
const container = {
	show: {
		transition: {
			staggerChildren: 0.1
		}
	}
};
const TaskManagementContent = ()=>{
  const dispatch = useAppDispatch()
  const tasks = useAppSelector(state=> state.taskManagementReducer.taskManagement.taskList.data)
  const pageNumber  = useAppSelector((state) => state.taskManagementReducer.taskManagement.taskList.pagination.pageNumber)
  const pageSize  = useAppSelector((state) => state.taskManagementReducer.taskManagement.taskList.pagination.pageSize)
  const totalRow =  useAppSelector((state) => state.taskManagementReducer.taskManagement.taskList.pagination.totalRow)
  const [openEditSuccessNotify, setOpenEditSuccessNotify] = useState(false);
  const [openEditFailNotify, setOpenEditFailNotify] = useState(false);
  const [showEdit, setShowEdit] =useState(false)
  const [showView, setShowView] =useState(false)
  const [editValue, setEditValue] =useState({})
  useEffect(()=>{
      dispatch(setTaskDataToEmpty())
      dispatch(getTaskData({status: 'To do', pageNumber: pageNumber, pageSize: pageSize}))
  },[pageNumber, pageSize])
    return <div className="w-full flex flex-col min-h-full bg-white">
    <FuseScrollbars className="overflow-x-auto grow">
<Table className="min-w-xl" aria-labelledby="tableTitle" >
<TableHead style={{background:'rgb(250, 251, 254)'}}>
    <TableRow>
    <TableCell align="left"><span className='font-semibold'>Title</span></TableCell>
    <TableCell align="left"><span className='font-semibold'>Description</span></TableCell>
    <TableCell width={'15%'} align="left"><span className='font-semibold'>Start at</span></TableCell>
    <TableCell width={'15%'} align="left"><span className='font-semibold'>Deadline</span></TableCell>
    <TableCell width={'15%'} align="left"><span className='font-semibold'>Created at</span></TableCell>
    <TableCell align="left"><span className='font-semibold'>Action</span></TableCell>
    </TableRow>
    </TableHead>
    {tasks && tasks.length > 0 && <TableBody>
        {tasks.map((item) => (<TableRow key={item.id} >
        <TableCell align='left'>{item.title}</TableCell>
        <TableCell align='left'>{item.description}</TableCell>
        <TableCell align='left'>{new Date(item.startAt).toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })}</TableCell>
        <TableCell align='left'>{new Date(item.deadline).toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })}</TableCell>
        <TableCell align='left'>{new Date(item.createAt).toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })}</TableCell>
        <TableCell>
            {item.status !== 'To do' ? <Tooltip title='View detail'>
            <FuseSvgIcon className="text-48 ms-10" size={24} color="action" style={{cursor:'pointer'}} 
            onClick={()=>{setShowView(true); setEditValue(item)}}
            >heroicons-solid:eye</FuseSvgIcon>
            </Tooltip> : <Tooltip title='Edit'>
            <FuseSvgIcon className="text-48 ms-10" size={24} color="action" style={{cursor:'pointer'}} 
            onClick={()=>{setShowEdit(true); setEditValue(item)}}
            >heroicons-solid:pencil-alt</FuseSvgIcon>
            </Tooltip>}
        </TableCell>
    </TableRow>))}
    </TableBody>}
    </Table>
{tasks && tasks.length===0 && <Stack className='mt-36' direction='row' alignItems={"center"} justifyContent={"center"}>
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
  {showEdit && <EditModal setOpenFailSnackbar={setOpenEditFailNotify} setOpenSuccessSnackbar={setOpenEditSuccessNotify} object={editValue} show={showEdit} handleClose={() => setShowEdit(false)} />}
  {showView && <ViewModal object={editValue} setOpenSuccessSnackbar={setOpenEditSuccessNotify} show={showView} handleClose={() => setShowView(false)} />}
</div>
}
export default TaskManagementContent