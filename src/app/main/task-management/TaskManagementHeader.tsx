import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CreateModal from './CreateModal';
import { useAppDispatch, useAppSelector } from 'app/store';
import { getTaskData, setFilterStatus} from './slice/taskManagementSlice';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
const TaskManagementHeader = ()=>{
    const dispatch= useAppDispatch()
    const [show,setShow]=useState(false)
    const [openCreateSuccessNotify, setOpenCreateSuccessNotify] = useState(false);
    const [openCreateFailNotify, setOpenCreateFailNotify] = useState(false);
    const comboboxList = ['To do', 'In progress', 'Work finished', 'Done']
    const [value, setValue] = useState<string | null>(comboboxList[0]);
    const inputValue = useAppSelector(state  => state.taskManagementReducer.taskManagement.filterStatus)
    const pageSize  = useAppSelector((state) => state.taskManagementReducer.taskManagement.taskList.pagination.pageSize)
    useEffect(()=>{
        dispatch(getTaskData({status: inputValue, pageNumber: 0, pageSize: pageSize}))
    },[inputValue])
    return <div style={{background:'rgb(241, 245, 249)'}} className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-24 md:px-32">
    <motion.span
        initial={{ x: -20 }}
        animate={{ x: 0, transition: { delay: 0.2 } }}
    >
        <Typography className="text-24 md:text-32 font-extrabold tracking-tight">Task management</Typography>
    </motion.span>
    <motion.div  initial={{ opacity: 0, x: 20 }}  animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}>
        <Stack direction="row" spacing={2}>

         <Autocomplete size='small' value={value} disableClearable
        onChange={(event: any, newValue: string | null) => {
          setValue(newValue);
          dispatch(setFilterStatus(newValue))
        }}
        options={comboboxList}
        sx={{ width: 200 }}
        renderInput={(params) => <TextField  sx={{background:'white'}} {...params} label="Status" />}
      />
            <Button onClick={()=>setShow(true)} variant="contained" color="secondary" startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
            >Add task</Button>

        </Stack>
        </motion.div>
        <Snackbar open={openCreateSuccessNotify} autoHideDuration={3000} onClose={()=>{setOpenCreateSuccessNotify(false)}} anchorOrigin={{vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={()=>{setOpenCreateSuccessNotify(false)}}
          severity="success" variant="filled" sx={{ width: '100%' }}>
          Add successfully
        </Alert>
      </Snackbar>
    <Snackbar open={openCreateFailNotify} autoHideDuration={3000} onClose={()=>{setOpenCreateFailNotify(false)}} anchorOrigin={{vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={()=>{setOpenCreateFailNotify(false)}}
          severity="error" variant="filled" sx={{ width: '100%' }}>
          Add failed
        </Alert>
      </Snackbar>
{show && <CreateModal setOpenSuccessSnackbar={setOpenCreateSuccessNotify} setOpenFailSnackbar={setOpenCreateFailNotify} show={show} handleClose={()=>{setShow(false)}}/>}
</div>
}
export default TaskManagementHeader   