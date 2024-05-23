import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { useAppDispatch, useAppSelector } from 'app/store';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import { editTicketData,getTicketData } from './slice/ticketSlice';
import axios from 'src/app/auth/services/api/customAxios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
const ViewModal = ({show,handleClose, object, setOpenSuccessSnackbar, setOpenFailSnackbar})=>{
  const [ticket, setTicket] =useState({
    "id": object.id,
    "ticketCategory": object.ticketCategory,
    "title": object.title,
    "creator": {
        "name": object.creator.name
    },
    "priority": object.priority,
    "description": object.description,
    "image": object.image,
    "status": object.status,
    "createAt": object.createAt,
    "resultDescription":object.resultDescription,
    "resultImage": object.resultImage
  }) 
  const [ticketStatus, setTicketStatus] = useState(object.status)
  const [file, setFile] =useState(object.image)
  const [checkStatus, setcheckStatus] = useState(false)
  const [checkAssignee, setcheckAssignee] = useState(false)
  const pageNumber  = useAppSelector((state) => state.foodReducer.foodReducer.foods.pagination.pageNumber)
  const pageSize  = useAppSelector((state) => state.foodReducer.foodReducer.foods.pagination.pageSize)
  const [value,setValue] =useState(object.assignee === null ? {label: '', value: ''} : 
    {label: object.assignee.name, value: object.assignee.id})
  const dispatch = useAppDispatch()
 
  const [showSnackbar, setShowSnackbar]=useState(false)
    const edit = async() => {
      const formData = new FormData()
      const formDataForProcessingStatus = new FormData()
        formData.append('assigneeId',value === null ? null : value.value)
        formData.append('status',ticketStatus)
        formDataForProcessingStatus.append('assigneeId',value === null ? null : value.value)
        formDataForProcessingStatus.append('status','Processing')
        formDataForProcessingStatus.append('resultImage', null)
        formDataForProcessingStatus.append('resultDescription', null)
        if(ticketStatus === 'Processing'){
          await dispatch(editTicketData({id: ticket.id, formData: formDataForProcessingStatus}))
        }else await dispatch(editTicketData({id: ticket.id, formData: formData}))
        await dispatch(getTicketData({status: object.status, pageNumber: pageNumber, pageSize: pageSize}))
        setOpenSuccessSnackbar(true)
        handleClose()
    }  
    
    const [combobox,setCombobox] = useState([]);
    const loadCombobox = async () => {
        try {
            const res = await axios.get(`/staffs`)
            if (res.data.length > 0) {
            const updatedComboboxList = res.data.map((item) => ({
            label: item.name,
            value: item.id
            }));
                setCombobox(updatedComboboxList);
            }
        } catch (error) {
            console.log(error)
        }
    };
    useEffect(() => {
        loadCombobox();
      }, []);
    return <Dialog fullWidth open={show} onClose={handleClose} classes={{paper: 'max-w-lg w-full m-8 sm:m-24' }}>
    <DialogTitle>
      <Stack direction='row' className='justify-between'>
      Ticket detail
      <Stack direction='row' spacing={2}>
      <Autocomplete size='small' value={ticketStatus} disableClearable
            onChange={(event: any, newValue: string | null) => { 
            setTicketStatus(newValue); 
            }}
            options={['Processing','Rejected','Done']} sx={{ width: 200 }} renderInput={(params) => <TextField  sx={{background:'white'}} {...params} label="Status" />}
        />
        <Button variant="contained" style={{pointerEvents: "none"}} color={ticket.priority.toLowerCase() === 'low' ? 'success' :
ticket.priority.toLowerCase() === 'moderate' ? 'warning' : 'error'}>{ticket.priority}</Button>
      </Stack>
      </Stack>
    </DialogTitle>
    <DialogContent>
    <Stack direction='column' spacing={2} className='pt-5'>
        <Typography><b>Created at:</b> {new Date(ticket.createAt).toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })}</Typography>
        <Typography><b>Created by:</b> {ticket.creator.name}</Typography>
        <Typography><b>Type:</b> {ticket.ticketCategory}</Typography>
        <Typography><b>Title:</b> {ticket.title}</Typography>
        <Typography><b>Description:</b> {ticket.description}</Typography>
        <Stack direction='row' spacing={2}>
            <Typography><b>Solver:</b></Typography>
            <Autocomplete size='small' value={value} disableClearable
            onChange={(event: any, newValue: {label: string, value: string} | null) => { 
              setValue(newValue);
            }}
            options={combobox} sx={{ width: 300 }} renderInput={(params) => <TextField  sx={{background:'white'}} {...params} label="select a staff" />}
        />
        </Stack>
        <Typography><b>Solver reply:</b> {(ticket.resultDescription === null || ticket.resultDescription === "null") ? 'A staff is processing' : ticket.resultDescription}</Typography>
        <Typography><b>Solver's picture:</b> {ticket.resultImage === null && 'A staff is processing'}</Typography>
        {ticket.resultImage !== null && ticket.resultImage !== "null"  && <img src={ticket.resultImage} alt="Selected Image" style={{ marginTop: '10px', maxWidth: '100%' }} />}
        <Typography><b>Problem's picture:</b></Typography>
        {file && <img src={file} alt="Selected Image" style={{ marginTop: '10px', maxWidth: '100%' }} />}
    </Stack>
    </DialogContent>
    <DialogActions>
      <Button variant='contained' onClick={handleClose}>Close</Button>
      <Button variant='contained' onClick={edit} color='success'>Edit</Button>
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