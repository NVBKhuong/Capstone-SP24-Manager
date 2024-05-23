import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { useAppDispatch,useAppSelector } from 'app/store';
import axios from 'src/app/auth/services/api/customAxios';
import Autocomplete from '@mui/material/Autocomplete';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';
import { addTask, getTaskData,setFilterStatus } from './slice/taskManagementSlice';
import FormControlLabel from '@mui/material/FormControlLabel';
import jwtDecode from 'jwt-decode';
const CreateModal=({handleClose, show,setOpenFailSnackbar, setOpenSuccessSnackbar})=>{
  const managerId = jwtDecode(localStorage.getItem('jwt_access_token')).id

  const [taskName, setTaskName] =useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [taskBegin, setTaskBegin] = useState(new Date())
    const [taskDeadline, setTaskDeadline] = useState(() => {
      const deadline = new Date(taskBegin);
      deadline.setDate(deadline.getDate() + 1);
      return deadline;
    });
    const [inputChecklistValue, setInputChecklistValue] =useState('')
   
    const [workingHours, setWorkingHours] = useState(1)
    const [checklists, setChecklists] =useState([])
    const [staffList, setStaffList] =useState([])
    const [checkName, setCheckName] = useState(false)
    const [checkStaffList, setCheckStaffList] = useState(false)
    const [checkChecklists, setCheckChecklists]=useState(false)
    const dispatch = useAppDispatch()
    const pageNumber  = useAppSelector((state) => state.taskManagementReducer.taskManagement.taskList.pagination.pageNumber)
    const pageSize  = useAppSelector((state) => state.taskManagementReducer.taskManagement.taskList.pagination.pageSize)    
    const checkValid= () =>{
      let check: boolean = true
      if(taskName.trim() === '') {setCheckName(true)} else setCheckName(false)
      if(staffList.length === 0) {setCheckStaffList(true)} else setCheckStaffList(false)
      if(checklists.length === 0) {setCheckChecklists(true)} else setCheckChecklists(false)
      if(taskName.trim() === '' || staffList.length === 0 || checklists.length === 0){
          check = false
      }
      return check;
    }
  
    const add = async() => {
      const validate = checkValid()
      if(validate) {
        await dispatch(addTask({
          "title": taskName,
          "description": taskDescription,
          "managerId": managerId,
          "startAt": taskBegin,
          "deadline": taskDeadline,
          "status": "To do",
          "assigneeIds": staffList,
          "checkLists": checklists,
          "workingHours": workingHours,
        }))
        await dispatch(getTaskData({pageNumber: pageNumber, pageSize: pageSize, status:'To do'}))
        dispatch(setFilterStatus('To do'))
        setOpenSuccessSnackbar(true)
        handleClose()
      } else setOpenFailSnackbar(true)
      
    }  

    const [orderCount, setOrderCount] = useState(0);
    const handleAddChecklistItem =()=>{
      setChecklists(prevChecklists => [...prevChecklists, {
        "title": inputChecklistValue,
        "order": orderCount 
      }]);
      setInputChecklistValue('')
      setOrderCount(prevOrderCount => prevOrderCount + 1)
    }
    const handleDeleteChecklistItem =(indexToRemove)=>{
      setChecklists(prevChecklists =>
        prevChecklists.filter((_, index) => index !== indexToRemove)
      );
    }
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
      const totalStaff = staffList.length
      const millisecondsPerDay = 1000 * 60 * 60 * 24; // Số milliseconds trong một ngày
      const millisecondsBetween = taskDeadline.getTime() - taskBegin.getTime(); // Số milliseconds giữa hai ngày
      const daysBetween = Math.ceil(millisecondsBetween / millisecondsPerDay); // Số ngày giữa hai ngày
      const workingHoursDailyOfTask = Math.ceil(workingHours / daysBetween);
      if ((workingHoursDailyOfTask/totalStaff) > 8) {
        setWarning(true);
      } else {
        setWarning(false);
      }
    }, [staffList, workingHours, taskBegin, taskDeadline]);
    return <Dialog open={show} classes={{
        paper: 'max-w-lg w-full m-8 sm:m-24'
    }} onClose={handleClose} >
    <DialogTitle id="alert-dialog-title">
      <Stack direction='row' className='justify-between'>
      Create
      </Stack>
    </DialogTitle>
    <DialogContent>
     
      <Stack direction='row' spacing={2} className='pt-5'>
      <TextField value={taskName} onChange={(e)=> setTaskName(e.target.value)} helperText={checkName ? "This field is required" : false} 
      error={checkName} sx={{width:'40%'}} placeholder='Enter task title' label="Title" variant="outlined"/>
      <DateTimePicker minDate={new Date()} value={taskBegin} format="dd/MM/yyyy, hh:mm a"
							onChange={(value) => {
                setTaskBegin(value);
                const deadline = new Date(value);
                deadline.setDate(deadline.getDate() + 1);
                setTaskDeadline(deadline);
              }} className="w-full sm:w-auto"
							slotProps={{
								textField: {
									label: 'Start date',
									placeholder: 'Choose a start date',
									InputLabelProps: {
										shrink: true
									},
									variant: 'outlined'
								}
							}}
						/>
      <DateTimePicker minDate={taskBegin} value={taskDeadline} format="dd/MM/yyyy, hh:mm a"
							onChange={(value) => setTaskDeadline(value)} className="w-full sm:w-auto"
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
      
      <TextField value={taskDescription} onChange={e => setTaskDescription(e.target.value)} className='mb-8 mt-14' label="Description" multiline rows="4" variant="outlined" fullWidth />
      
      <div className="flex-1 mb-24">
						<div className="flex items-center mt-16 mb-12">
							<FuseSvgIcon size={20}>heroicons-outline:users</FuseSvgIcon>
							<Typography className="font-semibold text-16">Staffs</Typography>
              <FormControlLabel className='me-28' control={<TextField
      value={workingHours}
      onChange={e => {
        const value = e.target.value.trim(); // Trim any leading or trailing spaces
        if (value === '') {
          setWorkingHours(1);
        } else {
          const parsedValue = parseInt(value); // Parse the input value as an integer
          if (!isNaN(parsedValue)) {
            setWorkingHours(parsedValue); // Set the state to the parsed integer value
          }
        }}}
      type={'number'} size='small' inputProps={{ min: 1 }} sx={{ width: '10rem', marginLeft: '1rem' }}
    />} label="Working hours" labelPlacement='start' />
						{staffList.length >0 && (warning ? <Button variant="contained" style={{pointerEvents: "none"}} color='warning'>Staffs overtime</Button> : <Button variant="contained" style={{pointerEvents: "none"}} color='success'>Staffs within schedule</Button>)}
            </div>
						{staffs.length>0 && <Autocomplete multiple options={staffs}
              getOptionLabel={(option) => option.name}
              filterSelectedOptions
              onChange={(event, value) => {setStaffList(value.map(item=> item.id))}}
              renderInput={(params) => (
                <TextField error={checkStaffList} helperText={checkStaffList? 'This field is required': null}
                  {...params}
                  label="Staffs"
                  placeholder="Select multiple staffs"
                />
              )}
            />}
					</div>
      <div className="flex-1 mb-24">
						<div className="flex items-center mt-16 mb-12">
							<FuseSvgIcon size={20}>heroicons-outline:check</FuseSvgIcon>
							<Typography className="font-semibold text-16">Checklists</Typography>
						</div>			
      {checklists.length > 0 && <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
       {checklists.map((item,index) => <ListItem key={index} secondaryAction={
      <IconButton edge="end" onClick={()=>handleDeleteChecklistItem(index)}>
                     <FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
                    </IconButton>}>
        <Typography className="text-14">{item.title}</Typography>
      </ListItem>) }
    </List>}
    <Stack direction='row' spacing={2}>
    <TextField helperText={checkChecklists && 'Checklists cannot be empty'} error={checkChecklists} value={inputChecklistValue} onKeyPress={e => {if(e.key === 'Enter' && inputChecklistValue.trim() !== '') handleAddChecklistItem()}}
    onChange={(e)=>setInputChecklistValue(e.target.value)} size='small'
    fullWidth placeholder='Add checklist' variant="outlined" />
    <Fab
					className="mx-4"
					aria-label="Add"
					size="small"
					color="secondary" onClick={handleAddChecklistItem}
					disabled={inputChecklistValue.trim() === '' ? true : false}
				>
					<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>
				</Fab>
    </Stack>
    </div>
    </DialogContent>
    <DialogActions>
      <Stack direction='row' spacing={2} className='me-14 mb-5'>
      <Button variant='contained' onClick={handleClose}>Cancel</Button>
      <Button variant='contained' color='secondary' onClick={add} >Add</Button>
      </Stack>
    </DialogActions>
  </Dialog>

       }
export default CreateModal