import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { useAppDispatch, useAppSelector } from 'app/store';
import { editFood, getFoodData } from './slice/foodSlice';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'src/app/auth/services/api/customAxios';
const EditModal = ({show,handleClose, object, setOpenSuccessSnackbar, setOpenFailSnackbar})=>{
  const [food, setFood] =useState({
    "id": object.id,
    "thumbnail": object.thumbnailUrl,
    "name": object.name,
    "foodCategoryId":{
      label: object.foodCategory.name, value: object.foodCategory.id
    },
    "quantity": object.quantity,
    "unitOfMeasurementId":{
      label: object.unitOfMeasurement.name, value: object.unitOfMeasurement.id
    },
    "status": object.status
  }) 
  const [file, setFile] =useState(object.thumbnailUrl)
  const [checkName, setCheckName] = useState(false)
  const [checkThumbnail, setCheckThumbnail] = useState(false)
  const [checkFoodCategory, setCheckFoodCategory] = useState(false)
  const [checkUnit, setCheckUnit] = useState(false)
  const [checkStatus, setcheckStatus] = useState(false)
    const pageNumber  = useAppSelector((state) => state.foodReducer.foodReducer.foods.pagination.pageNumber)
    const pageSize  = useAppSelector((state) => state.foodReducer.foodReducer.foods.pagination.pageSize)
    const dispatch = useAppDispatch()
    const checkValid= () =>{
      let check: boolean = true
      if(food.name.trim() === '') {setCheckName(true)} else setCheckName(false)
      if(food.foodCategoryId.value === '') {setCheckFoodCategory(true)} else setCheckFoodCategory(false)
      if(food.thumbnail === '') { setCheckThumbnail(true)} else setCheckThumbnail(false)
      if(food.unitOfMeasurementId === null) { setCheckUnit(true)} else setCheckUnit(false)
      if(food.status === '' || food.status === null) { setcheckStatus(true)} else setcheckStatus(false)
      if(food.status === '' || food.status === null || food.name.trim() === '' || food.foodCategoryId.value === '' || food.thumbnail === '' || food.thumbnail === null || food.unitOfMeasurementId === null){
          check = false
      }
      return check;
    }

    const edit = async() => {
      const validate = checkValid()
      const formData = new FormData()
      if(validate) {
        const id:string = food.id
        formData.append('thumbnail',file)
        formData.append('name',food.name)
        formData.append('foodCategoryId',food.foodCategoryId.value)
        formData.append('quantity',food.quantity.toString())
        formData.append('unitOfMeasurementId',food.unitOfMeasurementId.value)
        formData.append('status',food.status)
        await dispatch(editFood({id, formData}))
        await dispatch(getFoodData({pageNumber: pageNumber, pageSize: pageSize}))
        setOpenSuccessSnackbar(true)
        handleClose()
      }else setOpenFailSnackbar(true)
    }  

    const [comboboxFoodCategory,setComboboxListFoodCategory] = useState([]);
    const [comboboxUOM,setComboboxUOM] = useState([]);
    const loadCombobox = async () => {
      const res = await axios.get(`/food-categories`)
      const res1 = await axios.get(`/unit-of-measurements`)
      if (res.data.length > 0) {
        const updatedComboboxList = res.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setComboboxListFoodCategory(updatedComboboxList);
      }
      if (res1.data.length > 0) {
        const updatedComboboxList = res1.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setComboboxUOM(updatedComboboxList);
      }
    };

    useEffect(() => {
      loadCombobox();
    }, []);
    return <Dialog fullWidth
    open={show}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
      Edit
    </DialogTitle>
    <DialogContent>
        <Stack direction='column' spacing={2} className='pt-5'>
        <TextField helperText={checkName ? "This field is required" : false} 
      error={checkName ? true : false} value={food.name}
      onChange={e => setFood(prev => ({...prev, name: e.target.value}))} label='Name' 
      placeholder='Enter name' size='small' variant="outlined" />
   
    {comboboxFoodCategory.length>0 &&<Autocomplete
              disablePortal  value={food.foodCategoryId}
              onChange={(event: any, newValue: any) => {
                setFood(prev => ({...prev, foodCategoryId: newValue}))
              }}
              options={comboboxFoodCategory} size='small'
              fullWidth
              renderInput={(params) => <TextField {...params} label={'Food categories'} helperText={checkFoodCategory ? "This field is required" : false}  
              error={checkFoodCategory ? true : false}/>}
            />}
      <TextField  value={food.quantity} type="number" InputProps={{ inputProps: { min: 0 } }}
      onChange={e => setFood(prev => ({...prev, quantity: parseInt(e.target.value)}))} label='Quantity' 
      placeholder='Enter name' size='small' variant="outlined" />

      {comboboxUOM.length>0 &&<Autocomplete
                  disablePortal  value={food.unitOfMeasurementId}
                  onChange={(event: any, newValue: any) => {
                    setFood(prev => ({...prev, unitOfMeasurementId: newValue}))
                  }}
                  options={comboboxUOM} size='small'
                  fullWidth
                  renderInput={(params) => <TextField {...params} label={'Unit'} helperText={checkUnit ? "This field is required" : false}  
                  error={checkUnit ? true : false}/>}
                />}
                
               <Autocomplete
                  disablePortal  value={food.status}
                  onChange={(event: any, newValue: any) => {
                    setFood(prev => ({...prev, status: newValue}))
                  }}
                  options={['Available','Disable']} size='small'
                  fullWidth
                  renderInput={(params) => <TextField {...params} label={'Status'} helperText={checkStatus ? "This field is required" : false}  
                  error={checkStatus ? true : false}/>}
                />

            <Stack direction="row" spacing={2}>
              <Button variant='contained' onClick={()=>document.getElementById('fileInput').click()}>
                  <FuseSvgIcon>heroicons-outline:cloud-upload</FuseSvgIcon>
                  Upload image
              </Button>
              <input id="fileInput" type="file" hidden={true} onChange={(e: any) => {
              setFood(prev => ({...prev, thumbnail: e.target.files[0] === undefined ? null : URL.createObjectURL(e.target.files[0])}))
              setFile(e.target.files[0])
            }} />
            {file && <Button variant='contained' onClick={()=>{setFood(prev => ({...prev, thumbnail: null }))
                    setFile(null)}}>
                  <FuseSvgIcon>heroicons-outline:x-circle</FuseSvgIcon>
                  Clear image
            </Button>}
            </Stack>
            {food.thumbnail === null && <div style={{color:'red'}}>Thumbnail is required!</div>}
            {file && <img src={food.thumbnail} alt="Selected Image" style={{ marginTop: '10px', maxWidth: '100%' }} />}
        </Stack>
    </DialogContent>
    <DialogActions>
      <Button variant='contained' onClick={handleClose}>Cancel</Button>
      <Button variant='contained' color='success' onClick={edit} >Edit</Button>
    </DialogActions>
    
  </Dialog>
}

export default EditModal