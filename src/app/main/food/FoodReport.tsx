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
import { getFoodReportData, setPaginPageNumberReport,setPaginPageSizeReport } from './slice/foodSlice';
import { useAppDispatch,useAppSelector } from 'app/store';

export default function FoodReport(){
    const dispatch=useAppDispatch()
    const foodReports  = useAppSelector((state) => state.foodReducer.foodReducer.foodReports.data)
    const pageNumber  = useAppSelector((state) => state.foodReducer.foodReducer.foodReports.pagination.pageNumber)
    const pageSize  = useAppSelector((state) => state.foodReducer.foodReducer.foodReports.pagination.pageSize)
    const totalRow =  useAppSelector((state) => state.foodReducer.foodReducer.foodReports.pagination.totalRow)
    useEffect(()=>{
        dispatch(getFoodReportData({pageNumber: pageNumber, pageSize: pageSize}))
    },[pageNumber, pageSize])
    
    return <div className="w-full flex flex-col min-h-full bg-white shadow-2">
    <FuseScrollbars className="grow overflow-x-auto">
        <Table className="min-w-xl" aria-labelledby="tableTitle" >   
        <TableHead style={{background:'rgb(250, 251, 254)'}}>
  <TableRow>
    <TableCell align="left"><span className='font-semibold'>Name</span></TableCell>
    <TableCell align="left"><span className='font-semibold'>Category</span></TableCell>
    {/* <TableCell align="left"><span className='font-semibold'>Current quantity</span></TableCell> */}
    <TableCell align="left"><span className='font-semibold'>Last quantity</span></TableCell>
    <TableCell align="left"><span className='font-semibold'>Remain quantity</span></TableCell>
    <TableCell align="left"><span className='font-semibold'>Updated by</span></TableCell>
    <TableCell align="left"><span className='font-semibold'>Updated at</span></TableCell>
  </TableRow>
</TableHead>
    {foodReports && foodReports.length > 0 && <TableBody>
        {foodReports.map((item) => (<TableRow key={item.id} >
        <TableCell align='left'>{item.food.name}</TableCell>
        <TableCell align='left'>{item.food.foodCategory.name}</TableCell>
        {/* <TableCell align='left'>{item.food.quantity} {item.food.unitOfMeasurement.name}</TableCell> */}
        <TableCell align='left'>{item.lastQuantity} {item.food.unitOfMeasurement.name}</TableCell>
        <TableCell align='left'>{item.remainQuantity} {item.food.unitOfMeasurement.name}</TableCell>
        <TableCell align='left'>{item.staff.name}</TableCell>
        <TableCell align='left'>{new Date(item.createDate).toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })}</TableCell>
    </TableRow>))}
        </TableBody>}
        </Table>
    {foodReports && foodReports.length===0 && <Stack className='mt-36' direction='row' alignItems={"center"} justifyContent={"center"}>
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
            dispatch(setPaginPageNumberReport(newPage))
        }}
        onRowsPerPageChange={(event) => {
            dispatch(setPaginPageSizeReport(parseInt(event.target.value)))
            dispatch(setPaginPageNumberReport(0))
            }}
    />
</div>
}