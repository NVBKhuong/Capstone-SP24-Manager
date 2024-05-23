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
import FormControlLabel from '@mui/material/FormControlLabel';

const EditModal = ({show,handleClose,object, setOpenSuccessSnackbar, setOpenFailSnackbar})=>{
  const [assignee, setAssignee] = useState(object.assignStaffs.map(item => item.staff))
  const [checklists, setChecklists] =useState(object.checkLists)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showAssignToChecklistNotification, setShowAssignToChecklistNotification] = useState(false);
  const [msgCheck, setMsgCheck] = useState(false)
  const [task, setTask] =useState({
    title: object.title,
    description: object.description,
    deadline: object.deadline,
    status: object.status,
    startAt: object.startAt,
    workingHours: object.workingHours
  }) 
  
  const [value, setValue] =useState(object.status)
    const [checkName, setCheckName] = useState(false)
    const [checkTaskStatus, setCheckTaskStatus] = useState(false)
    const pageNumber  = useAppSelector((state) => state.taskManagementReducer.taskManagement.taskList.pagination.pageNumber)
    const pageSize  = useAppSelector((state) => state.taskManagementReducer.taskManagement.taskList.pagination.pageSize)
    const dispatch = useAppDispatch()
    const checkValid= () =>{
      let check: boolean = true
      if(task.title.trim() === '') {setCheckName(true)} else setCheckName(false)
      if(task.status === '' || task.status === null) {setCheckTaskStatus(true)} else setCheckTaskStatus(false)
      if(task.title.trim() === '' || task.status === '' || task.status === null){
          check = false
      }
      return check;
    }
  
    const edit = async() => {
      const validate = checkValid()
      if(validate) {
        await dispatch(editTask({id: object.id, object: task}))
        await dispatch(getTaskData({pageNumber: pageNumber, pageSize: pageSize, status: 'To do'}))
        setOpenSuccessSnackbar(true)
        handleClose()
      }else setOpenFailSnackbar(true)
    }  
    
    const comboboxList = ['To do', 'In progress', 'Work finished', 'Done', 'Cancel']
    const [staffs, setStaffs] = useState([])
    const loadStaffs = async() => {
      const res = await axios.get('/staffs')
      if (res.data.length > 0) {
        setStaffs(res.data);
      }
    }
    useEffect(()=>{loadStaffs()},[])
    const [warning, setWarning] =useState(false)
    useEffect(() => {
      const totalStaff = assignee.length
      const millisecondsPerDay = 1000 * 60 * 60 * 24; // Số milliseconds trong một ngày
      const millisecondsBetween = new Date(task.deadline).getTime() - new Date(task.startAt).getTime(); // Số milliseconds giữa hai ngày
      const daysBetween = Math.ceil(millisecondsBetween / millisecondsPerDay); // Số ngày giữa hai ngày
      const workingHoursDailyOfTask = Math.ceil(task.workingHours / daysBetween);
      if ((workingHoursDailyOfTask/totalStaff) > 8) {
        setWarning(true);
        // console.log('ổn\'t')
      } else {
        setWarning(false);
        // console.log('ổn')
      }
    }, [assignee, task.deadline, task.startAt, task.workingHours]);

    return <Dialog classes={{
      paper: 'max-w-lg w-full m-8 sm:m-24'
  }}
    open={show}
    onClose={handleClose} >
    <DialogTitle id="alert-dialog-title">
      <Stack direction='row' className='justify-between	'>
      Edit
      <Autocomplete disablePortal value={value} onChange={(event: any, newValue: string | null) => {
          setValue(newValue);
        }} size='small'
        inputValue={task.status}
        onInputChange={(event, newInputValue) => {
            setTask(prev => ({...prev, status: newInputValue}))
        }}
        options={comboboxList}
      sx={{ width: 200 }}
      renderInput={(params) => <TextField {...params} label="Status" error={checkTaskStatus} helperText={checkTaskStatus ? "This field can not empty" : null} />}
    />
      </Stack>
    </DialogTitle>
    <DialogContent>
    <Stack direction='row' spacing={2} className='pt-5'>
      <TextField value={task.title} onChange={e => setTask(prev => ({...prev, title: e.target.value}))} helperText={checkName ? "This field is required" : false} 
      error={checkName} style={{width:'40%'}} placeholder='Enter task title' label="Title" variant="outlined" />
      <DateTimePicker
              minDate={new Date()}
							value={new Date(task.startAt)}
							format="dd/MM/yyyy, hh:mm a "
							onChange={(value) => setTask(prev => ({...prev, startAt: value}))}
							className="w-full sm:w-auto"
							slotProps={{
								textField: {
									label: 'Start at',
									placeholder: 'Choose a start date',
									InputLabelProps: {
										shrink: true
									},
									variant: 'outlined'
								}
							}}
						/>
      <DateTimePicker
              minDate={new Date(task.startAt)}
							value={new Date(task.deadline)}
							format="dd/MM/yyyy, hh:mm a "
							onChange={(value) => setTask(prev => ({...prev, deadline: value}))}
							className="w-full sm:w-auto"
							slotProps={{
								textField: {
									label: 'Deadline',
									placeholder: 'Choose a deadline',
									InputLabelProps: {
										shrink: true
									},
									variant: 'outlined'
								}
							}}
						/>
      </Stack>
      <TextField value={task.description} onChange={e => setTask(prev => ({...prev, description: e.target.value}))} className='mb-8 mt-14' label="Description" multiline rows="4" variant="outlined" fullWidth />
      <div className="flex-1 mb-24">
						<div className="flex items-center mt-16 mb-12">
							<FuseSvgIcon size={20}>heroicons-outline:users</FuseSvgIcon>
							<Typography className="font-semibold text-16">Staffs</Typography>
              <FormControlLabel className='me-28' control={<TextField  value={task.workingHours} onChange={e => {
        const value = e.target.value.trim(); // Trim any leading or trailing spaces
        if (value === '') {
          setTask(prev => ({...prev, workingHours: 1}))
        } else {
          const parsedValue = parseInt(value); // Parse the input value as an integer
          if (!isNaN(parsedValue)) {
            setTask(prev => ({...prev, workingHours: parsedValue}))
          }
        }
      }}
     type={'number'} size='small' inputProps={{ min: 1 }} sx={{width:'10rem', marginLeft:'1rem'}}/>} label="Working hours" labelPlacement='start' />
						{assignee.length >0 && (warning ? <Button variant="contained" style={{pointerEvents: "none"}} color='warning'>Staffs overtime</Button> : <Button variant="contained" style={{pointerEvents: "none"}} color='success'>Staffs within schedule</Button>)}
            </div>
						{staffs.length>0 && <Autocomplete multiple options={staffs.filter(staff => !assignee.some(a => a.id === staff.id))}
            defaultValue={assignee} getOptionLabel={(option) => option.name}
              filterSelectedOptions
              onChange={async(event, value) => {
                if (value.length > assignee.length) {
                  // If a staff is added
                  const addedStaff = value.find(item => !assignee.some(a => a.id === item.id));
                  if (addedStaff) {
                    setMsgCheck(true)
                    await dispatch(assignStaff({
                      "taskId": object.id, 
                      "staffId": addedStaff.id
                    })); // Dispatch assignStaff action with the added staff
                    await dispatch(getTaskData({pageNumber: pageNumber, pageSize: pageSize, status: 'To do'}))
                    setShowSuccessNotification(true);
                  }
                } else if (value.length < assignee.length) {
                  // If a staff is removed
                  const removedStaff = assignee.find(item => !value.some(a => a.id === item.id));
                  if (removedStaff) {
                    setMsgCheck(false)
                    await dispatch(removeStaff({id: object.id, staffId: removedStaff.id})); // Dispatch removeStaff action with the removed staff's id
                    await dispatch(getTaskData({pageNumber: pageNumber, pageSize: pageSize, status: 'To do'}))
                    setShowSuccessNotification(true);
                  }
                }
                setAssignee(value); // Update local state with the new value
              }}
              renderInput={(params) => (
                <TextField 
                  {...params}
                  label="Staffs"
                  placeholder={"Select multiple staffs" }
                />
              )}
            />}
					</div>
      <div className="flex-1 mb-24">
						<div className="flex items-center mt-16 mb-12">
							<FuseSvgIcon size={20}>heroicons-outline:check</FuseSvgIcon>
							<Typography className="font-semibold text-16">Checklists</Typography>
						</div>			
      {checklists.length > 0 && <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
       {checklists.map((item) => <ListItem key={item.id}>
        <Stack direction='row' spacing={2} className='items-center'>
        <Checkbox disabled checked={item.status} />
        <Typography className="text-14" sx={{width:'40rem'}}>
          {item.title}
          </Typography>
        <Autocomplete options={assignee} size='small' sx={{ width: '20rem' }} 
              getOptionLabel={(option:any) => option.name} 
              defaultValue={item.asignee} onChange={async(event, value) => {
                try {
                  if(value !== null){
                    await dispatch(updateStaffForChecklist({checklistId: item.id, updateInfo: {"asigneeId": value.id, "status": item.status}}))
                    await dispatch(getTaskData({ pageNumber: pageNumber, pageSize: pageSize, status: 'To do'}))
                    setShowAssignToChecklistNotification(true);
                  }
                } catch (error) {
                  console.log(error)                  
                }
              }}
              readOnly={task.status !== 'To do' ? true : false}
              renderInput={(params) => (
                <TextField 
                  {...params}
                  placeholder={task.status !== 'To do' ? null : "Select a staff"}
                />
              )}
            />
        </Stack>
      </ListItem>) }
    </List>}
    </div>
    </DialogContent>
    <DialogActions>
    <Stack direction='row' spacing={2} className='me-14 mb-5'>
      <Button variant='contained' onClick={handleClose}>Cancel</Button>
      <Button variant='contained' color='success' onClick={edit} >Edit</Button>
      </Stack>
    </DialogActions>
    <Snackbar 
  open={showSuccessNotification} 
  autoHideDuration={3000} 
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  onClose={() => setShowSuccessNotification(false)}
>
  <Alert 
    onClose={() => setShowSuccessNotification(false)}
    severity="success" 
    variant="filled" 
    sx={{ width: '100%' }}
  >
    {`Staff ${msgCheck ? 'added' : 'removed'} successfully`}
  </Alert>
</Snackbar>
    <Snackbar 
  open={showAssignToChecklistNotification} 
  autoHideDuration={3000} 
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  onClose={() => setShowAssignToChecklistNotification(false)}
>
  <Alert 
    onClose={() => setShowAssignToChecklistNotification(false)}
    severity="success" 
    variant="filled" 
    sx={{ width: '100%' }}
  >
    Staff assigned to checklist successfully
  </Alert>
</Snackbar>
  </Dialog>
}

export default EditModal