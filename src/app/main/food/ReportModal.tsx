import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import instance from 'src/app/auth/services/api/customAxios';
import FuseLoading from '@fuse/core/FuseLoading';

const ReportModal = ({show, handleClose, food})=>{
    const [reports, setReports] = useState([])
    const loadReport =  () =>{
        instance.get<any,any>('/food-report',{params: {foodId: food.id}})
        .then((res)=>{
            const data = res.data
            if(data){
                setReports(data)
            }
        }).catch(err => {console.log(err)})
    }

    useEffect(()=>{
        food && loadReport()
    },[])
    return <Dialog classes={{
        paper: 'max-w-lg w-full m-8 sm:m-24'
    }} open={show} onClose={handleClose}>
    <DialogTitle>
      Food Report
    </DialogTitle>
    {reports.length>0 ? <DialogContent>
        <Stack direction='column' spacing={2}>
            <Stack direction='row' spacing={1}>
                <Typography className='font-semibold'>Food name:</Typography>
                <Typography>{food && food.name}</Typography>
            </Stack>
            <Stack direction='row' spacing={1}>
                <Typography className='font-semibold'>Food category:</Typography>
                <Typography>{food && food.foodCategory.name}</Typography>
            </Stack>
            <Table sx={{width:'100%'}}>
                <TableHead style={{background:'rgb(250, 251, 254)'}}>
                    <TableRow>
                        <TableCell align="left"><span className='font-semibold'>Last quantity</span></TableCell>
                        <TableCell align="left"><span className='font-semibold'>Remain quantity</span></TableCell>
                        <TableCell align="left"><span className='font-semibold'>Updated by</span></TableCell>
                        <TableCell align="left"><span className='font-semibold'>Updated at</span></TableCell>
                        <TableCell align="left" width='30%'><span className='font-semibold'>Note</span></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reports.map((item, index) => <TableRow key={item.id}>
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
                    <TableCell align='left' width='30%'>{item.description}</TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>
        </Stack>
    </DialogContent> : <FuseLoading/>}
    <DialogActions>
      <Button variant='contained' onClick={handleClose}>Cancel</Button>
    </DialogActions>
    
  </Dialog>
}

export default ReportModal