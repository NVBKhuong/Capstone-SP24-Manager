import FuseScrollbars from '@fuse/core/FuseScrollbars';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {useEffect, useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { getFoodData, setPaginPageNumber,setPaginPageSize } from './slice/foodSlice';
import { useAppDispatch,useAppSelector } from 'app/store';
import EditModal from './EditModal';

export default function FoodData(){
    const dispatch=useAppDispatch()
    const [editValue, setEditValue] =useState({})
    const [openEditSuccessNotify, setOpenEditSuccessNotify] = useState(false);
    const [openEditFailNotify, setOpenEditFailNotify] = useState(false);
	const [showEdit, setShowEdit] =useState(false)
    const foods  = useAppSelector((state) => state.foodReducer.foodReducer.foods.data)
    const pageNumber  = useAppSelector((state) => state.foodReducer.foodReducer.foods.pagination.pageNumber)
    const pageSize  = useAppSelector((state) => state.foodReducer.foodReducer.foods.pagination.pageSize)
    const totalRow =  useAppSelector((state) => state.foodReducer.foodReducer.foods.pagination.totalRow)
    useEffect(()=>{
        dispatch(getFoodData({pageNumber: pageNumber, pageSize: pageSize}))
    },[pageNumber, pageSize])
    
    return <div className="w-full flex flex-col min-h-full bg-white shadow-2">
    <FuseScrollbars className="grow overflow-x-auto">
        <Table className="min-w-xl" aria-labelledby="tableTitle" >   
        <TableHead style={{background:'rgb(250, 251, 254)'}}>
  <TableRow>
    <TableCell align="left"><span className='font-semibold'>Avatar</span></TableCell>
    <TableCell align="left"><span className='font-semibold'>Name</span></TableCell>
    <TableCell align="left"><span className='font-semibold'>Category</span></TableCell>
    <TableCell align="left"><span className='font-semibold'>Quantity</span></TableCell>
    <TableCell align="left"><span className='font-semibold'>Create at</span></TableCell>
    <TableCell align="left"><span className='font-semibold'>Status</span></TableCell>
    <TableCell align="left"><span className='font-semibold'>Action</span></TableCell>
  </TableRow>
</TableHead>
    {foods && foods.length > 0 && <TableBody>
        {foods.map((item) => (<TableRow key={item.id} >
            <TableCell className="w-52" component="th" scope="row" padding="none">
            {item.thumbnailUrl === null ? <></> :<a href={item.thumbnailUrl} target="_blank" rel="noopener noreferrer">
                <img className="w-full block rounded"  src={item.thumbnailUrl} alt='thumbnail' />
            </a>}
            </TableCell>
        <TableCell align='left'>{item.name}</TableCell>
        <TableCell align='left'>{item.foodCategory.name}</TableCell>
        <TableCell align='left'>{item.quantity} {item.unitOfMeasurement.name}</TableCell>
        <TableCell align='left'>{new Date(item.createAt).toLocaleDateString('en-Gb')}</TableCell>
        <TableCell align='left' >{item.status === 'Available' ? <Button style={{pointerEvents: "none"}} variant='contained' color='success'>Available</Button> : <Button style={{pointerEvents: "none"}} variant='contained' color='error'>Disable</Button>}</TableCell>
        <TableCell align='left'>
        <FuseSvgIcon className="text-48" size={24} style={{cursor:'pointer'}} onClick={()=>{setShowEdit(true); setEditValue(item)}} color="action">heroicons-solid:pencil-alt</FuseSvgIcon>
            
        </TableCell>
    </TableRow>))}
        </TableBody>}
        </Table>
    {foods && foods.length===0 && <Stack className='mt-36' direction='row' alignItems={"center"} justifyContent={"center"}>
        <h2 style={{color:"gray"}}>No matching result</h2></Stack> }
    </FuseScrollbars>

    <TablePagination
        className="shrink-0 border-t-1"
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
</div>
}