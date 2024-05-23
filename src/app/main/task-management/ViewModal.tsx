import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect,useState } from 'react';
import TextField from '@mui/material/TextField';
import { useAppDispatch, useAppSelector } from 'app/store';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'src/app/auth/services/api/customAxios';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { editTask,getTaskData,assignStaff,removeStaff,updateStaffForChecklist } from './slice/taskManagementSlice';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import instance from 'src/app/auth/services/api/customAxios';
const ViewModal = ({show,handleClose,object,setOpenSuccessSnackbar})=>{
  const [task, setTask] =useState({
    title: object.title,
    description: object.description,
    deadline: object.deadline,
    status: object.status,
    startAt: object.startAt,
    assignStaffs: object.assignStaffs,
    checkLists: object.checkLists
  }) 
  const [showSnackbar, setShowSnackbar]=useState(false)
    const pageNumber  = useAppSelector((state) => state.taskManagementReducer.taskManagement.taskList.pagination.pageNumber)
    const pageSize  = useAppSelector((state) => state.taskManagementReducer.taskManagement.taskList.pagination.pageSize)
    const dispatch = useAppDispatch()

    const edit = async() => {
        await dispatch(editTask({id: object.id, object: {status: task.status}}))
        await dispatch(getTaskData({pageNumber: pageNumber, pageSize: pageSize, status: object.status}))
        setOpenSuccessSnackbar(true)
        handleClose()
    }  
    
    const handleCheckChecklist = async(id,event)=>{
      const {checked} = event.target
      // console.log(checked)
      await instance.put(`/task-check-lists/${id}`, {"status": checked})
      .then(async()=>{
        await instance.get<any, any>(`/tasks/${object.id}`)
        .then((response) => {
          setTask(response)
          setShowSnackbar(true)
        }).catch(err => {console.log(err)})
      }).catch(err=>{console.log(err)})
    }
    
    return <Dialog classes={{paper: 'max-w-lg w-full m-8 sm:m-24' }}
    open={show} onClose={handleClose} >
    <DialogTitle id="alert-dialog-title">
      <Stack direction='row' className='justify-between	'>
      Task detail
      <Autocomplete disableClearable disablePortal value={task.status} size='small'onChange={(event, newValue) => { setTask({ ...task, status: newValue}); }}
        options={['In progress', 'Work finished', 'Done']}
      sx={{ width: 200 }}
      renderInput={(params) => <TextField {...params} label="Status"/>}
    />
      </Stack>
    </DialogTitle>
    <DialogContent>
    <Stack direction='column' spacing={2} className='pt-5'>
    <Typography><b>Date:</b> {new Date(task.startAt).toLocaleString('en-GB', { day: '2-digit', month: '2-digit',
          year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })} - {new Date(task.deadline).toLocaleString('en-GB', { day: '2-digit', month: '2-digit',
          year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
          </Typography>
          <Typography><b>Title:</b> {task.title}</Typography>
          <Typography><b>Description:</b> {task.description}</Typography>
      <div className="flex-1 mb-24">
						<div className="flex items-center mt-16">
							<FuseSvgIcon size={20}>heroicons-outline:users</FuseSvgIcon>
							<Typography className="font-semibold text-16 me-3">Staffs:</Typography>
              {task.assignStaffs.map(item => <Button style={{pointerEvents: "none"}} variant='contained' key={item.staff.id}>{item.staff.name}</Button>)}
						</div>
					</div>
      <div className="flex-1 mb-24">
						<div className="flex items-center mt-16">
							<FuseSvgIcon size={20}>heroicons-outline:check</FuseSvgIcon>
							<Typography className="font-semibold text-16">Checklists</Typography>
						</div>			
      {task.checkLists && task.checkLists.length > 0 && <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
       {task.checkLists.map((item) => <ListItem key={item.id}>
        <Stack direction='row' spacing={4} className='items-center'>
        <Checkbox checked={item.status} onChange={(e)=> {
          const updatedChecklists = task.checkLists.map(itemA => {
            if (itemA.id === item.id) {
              return { ...item, status: e.target.checked };
            }
            return itemA;
          });
        
          setTask(prevTask => ({
            ...prevTask,
            checkLists: updatedChecklists
          }));
          handleCheckChecklist(item.id, e)}}/>
        <Typography className="text-14" sx={{width: '65%'}}>
          {item.title}
          </Typography>
        {item.asignee && <Typography className="text-14" sx={{width: '35%'}}>
          Assigned to {item.asignee.name}
          </Typography>}
        </Stack>
      </ListItem>) }
    </List>}
    </div>
    </Stack>

    </DialogContent>
    <DialogActions>
    <Stack direction='row' spacing={2} className='me-14 mb-5'>
        <Button variant='contained' onClick={()=>{
          dispatch(getTaskData({pageNumber: pageNumber, pageSize: pageSize, status: object.status}))
          handleClose()
          }}>Cancel</Button>
        <Button variant='contained' color='success' onClick={edit} >Edit</Button>
    </Stack>
    </DialogActions>
    <Snackbar open={showSnackbar} autoHideDuration={3000} onClose={()=>{setShowSnackbar(false)}} anchorOrigin={{vertical: 'bottom', horizontal: 'center' }}>
    <Alert onClose={()=>{setShowSnackbar(false)}}
      severity="success" variant="filled" sx={{ width: '100%' }}>
      Edit successfully
    </Alert>
  </Snackbar>
  </Dialog>
}

export default ViewModal