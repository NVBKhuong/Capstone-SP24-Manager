import { Stack,Button, TextField, Typography, Autocomplete,Snackbar,Alert } from "@mui/material"
import { useState,useEffect } from "react"
import axios from "src/app/auth/services/api/customAxios"
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useAppDispatch } from "app/store";
import { addBird } from "../slice/birdSlice";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import instance from "src/app/auth/services/api/customAxios";
export default function AddBird(){
  const navigate=useNavigate()
  const [species, setSpecies]=useState([])
  const [caremodes, setCaremodes]=useState([])
  const [categories, setCategories]=useState([])
  const [cages, setCages]=useState([])
    const [bird, setBird]=useState({
      thumbnail: null, code: '', cage: {label:'',value:''},  species: {label:'',value:''}, careMode: {label:'',value:''}, category: {label:'',value:''},
      name: '', characteristic: '', gender: {label:'Male', value:false}, dayOfBirth: new Date().toString()
    })
    const [imageSend, setImageSend]=useState(null)
    const [errorConditions, setErrorConditions] = useState({
      name: false,
      code: false,
      thumbnail: false,
      gender: false,
      cage: false,
      species: false,
      careMode: false,
      category: false,
    });
    const dispatch=useAppDispatch()
    const loadData= async()=>{
        try {
            const resSpecies = await axios.get('/species')
          const resCaremode = await axios.get('/care-modes')
          const resBirdCategory = await axios.get('/bird-categories')
          const resCage = await axios.get('/cages')
            if (resSpecies.data) {
              const newList = resSpecies.data.map(item => ({
                label: item.name,
                value: item.id
              }));
              setSpecies(newList);
              setBird(prev => ({...prev, species: newList[0]}))
            }
            if (resCaremode.data) {
              const newList = resCaremode.data.map(item => ({
                label: item.name,
                value: item.id
              }));
              setCaremodes(newList);
              setBird(prev => ({...prev, careMode: newList[0]}))
            }
            if (resBirdCategory.data) {
              const newList = resBirdCategory.data.map(item => ({
                label: item.name,
                value: item.id
              }));
              setCategories(newList);
              setBird(prev => ({...prev, category: newList[0]}))
            }
            if (resCage.data) {
              const newList = resCage.data.map(item => ({
                label: item.name,
                value: item.id
              }));
              setCages(newList);
              setBird(prev => ({...prev, cage: newList[0]}))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const [successNotify, setSuccessNotify] = useState(false)
    const [failNotify, setFailNotify] = useState(false)
    const validation = () => {
      // Check if any of the required fields are empty
      if (
        bird.thumbnail === null ||
        bird.name === '' || bird.code === '' ||
        bird.gender.value === null ||
        bird.cage.value === '' ||
        bird.category.value === '' ||
        bird.species.value === '' ||
        bird.careMode.value === ''
      ) {
        return false; // Return false if any required field is empty
      }
      return true; // Return true if all required fields are filled
    };
    
    const add = async(e) =>{
      e.preventDefault()
      setErrorConditions({
        name: bird.name === '',
        code: bird.code === '',
        thumbnail: bird.thumbnail===null,
        gender: bird.gender === null,
        cage: bird.cage.value === '',
        species: bird.species.value === '',
        careMode: bird.careMode.value === '',
        category: bird.category.value === '',
      })
      // console.log(bird.thumbnail, bird.name, bird.code, bird.gender.value , bird.cage.value, bird.category.value, bird.species.value, bird.careMode.value)
      if(validation()){
        const formData = new FormData()
        formData.append('name',bird.name)
        formData.append('characteristic',bird.characteristic)
        formData.append('gender', bird.gender.value.toString())
        formData.append('dayOfBirth', new Date(bird.dayOfBirth).toISOString())
        formData.append('code',bird.code)
        formData.append('thumbnail',imageSend)
        formData.append('cageId',bird.cage.value)
        formData.append('speciesId',bird.species.value)
        formData.append('careModeId',bird.careMode.value)
        formData.append('categoryId',bird.category.value)
        const resBird = await dispatch(addBird(formData))
        if(resBird){
          // await instance.post(`/menus`,{name: `${bird.name}'s menu`}).then(
          //   async(res:any) => {
          //     const birdFormData = new FormData()
          //     birdFormData.append('menuId', res.id)
          //     await instance.put<any,any>(`/birds/${resBird.payload.id}`, birdFormData).then(
          //       ()=>{
          //         [
          //           {
          //               name: "Morning",
          //               from: "07:00:00",
          //               to: "09:00:00"
          //           },
          //           {
          //               name: "Lunch",
          //               from: "12:0:00",
          //               to: "14:00:00"
          //           },
          //           {
          //               name: "Afternoon",
          //               from: "17:00:00",
          //               to: "19:00:00"
          //           },
          //           {
          //               name: "Evening",
          //               from: "21:00:00",
          //               to: "22:00:00"
          //           }
          //       ].map(async(item) => await instance.post('/menu-meals',{
          //         "menuId": res.id,
          //         "name": item.name,
          //         "from": item.from,
          //         "to": item.to
          //       }))
          //       }
          //     ).catch(err => console.log(err))
          //   }
          // ).catch(err=>console.log(err))
          setSuccessNotify(true)
          navigate('/master-data/bird')
        }else setFailNotify(true)
      }
    }
    useEffect(()=>{
        loadData()
    },[])
    return <div className="w-full flex flex-col min-h-full bg-white">
    <Stack direction='row' spacing={4} className='justify-between mx-28 mt-28'>
    <Stack direction='column' spacing={2}>
      { (bird.thumbnail === null) ? <AddPhotoAlternateIcon className='h-3/5 w-full'/> : <img alt='bird-img' src={bird.thumbnail} className='rounded-12 h-3/5 w-full'/>}
      <Stack direction="row" spacing={2} className='justify-center'>
              <Button variant='contained' onClick={()=>document.getElementById('fileInput').click()}>
                  <FuseSvgIcon>heroicons-outline:cloud-upload</FuseSvgIcon>
                  Upload image
              </Button>
              <input id="fileInput" type="file" hidden={true} onChange={(e: any) => {
              setBird(prev => ({...prev, thumbnail: e.target.files[0] === undefined ? null : URL.createObjectURL(e.target.files[0])}))
              setImageSend(e.target.files[0])
            }} />
            {bird.thumbnail && <Button variant='contained' onClick={()=>{
              setBird(prev => ({...prev, thumbnail: null }))
              setImageSend(null)
              }}>
                  <FuseSvgIcon>heroicons-outline:x-circle</FuseSvgIcon>
                  Clear image
            </Button>}
            </Stack>
            {errorConditions.thumbnail && <Typography color='red'>Image is required</Typography>}
    </Stack>
    <Stack direction="column" spacing={2} width={'80%'}>
    <TextField error={errorConditions.name} fullWidth value={bird.name} label='Name *' onChange={e => setBird(prev => ({...prev, name: e.target.value}))}/>
    <TextField fullWidth value={bird.characteristic} label='Characteristic' onChange={e => setBird(prev => ({...prev, characteristic: e.target.value}))}/>
    <Stack direction='row' spacing={2}>
    <TextField size='small' value={bird.code} error={errorConditions.code} label='Code *' onChange={e => setBird(prev => ({...prev, code: e.target.value}))}/>
    <Autocomplete size='small' 
      value={bird.gender}
      onChange={(event: any, newValue: { label: string; value: boolean } | null) => {
        setBird(prev => ({
          ...prev,
          gender: newValue ? newValue : null
        }));
      }}
      options={[
        { label: 'Male', value: false },
        { label: 'Female', value: true }
      ]}
      sx={{ width: '15rem' }} renderInput={(params) => <TextField error={errorConditions.gender} sx={{ background: 'white' }} {...params} label="Gender *" />}
    />
    <DateTimePicker value={new Date(bird.dayOfBirth)} format="dd/MM/yyyy, hh:mm a" 
                  onChange={(value) => {
                      setBird(prev => ({ ...prev, dayOfBirth: value ?  value.toString() : new Date().toString()}));
                  }} className="w-full sm:w-auto"
                  slotProps={{
                    textField: {
                      size: 'small',
                      label: 'Birthdate',
                      placeholder: 'Choose a date',
                      InputLabelProps: {
                        shrink: true
                      },
                      variant: 'outlined'
                    }
                  }}
                />
    </Stack>
    <Stack direction='row' spacing={2}>
    {species.length > 0 && <Autocomplete size='small' 
      value={bird.species}
      onChange={(event: any, newValue: any) => {
        if (newValue !== null) { // Check if newValue is not null
          setBird(prev => ({
            ...prev,
            species: newValue
          }));
        } else {
          // Handle the case when the value is cleared
          setBird(prev => ({
            ...prev,
            species: {label:'',value:''}
          }));
        }
      }}
      options={species} 
      sx={{ width: '33%' }} renderInput={(params) => <TextField error={errorConditions.species} {...params} label="Species *" />}
    />}
    {caremodes.length > 0 && <Autocomplete size='small' 
      value={bird.careMode}
      onChange={(event: any, newValue: any) => {
        if (newValue !== null) { // Check if newValue is not null
          setBird(prev => ({
            ...prev,
            careMode: newValue
          }));
        } else {
          // Handle the case when the value is cleared
          setBird(prev => ({
            ...prev,
            careMode: { label: '', value: '' }
          }));
        }
      }}
      options={caremodes}
      sx={{ width: '33%' }} renderInput={(params) => <TextField error={errorConditions.careMode} {...params} label="Caremode *" />}
    />}
    {categories.length > 0 && <Autocomplete size='small' 
      value={bird.category}
      onChange={(event: any, newValue: any) => {
        if (newValue !== null) { // Check if newValue is not null
          console.log({ name: newValue.label, id: newValue.value })
          setBird(prev => ({
            ...prev,
            category: newValue
          }));
        } else {
          // Handle the case when the value is cleared
          setBird(prev => ({
            ...prev,
            category: { label: '', value: '' }
          }));
        }
      }}
      options={categories}
      sx={{ width: '33%' }} renderInput={(params) => <TextField {...params} error={errorConditions.category} label="Category *" />}
    />}
    </Stack>
    <Autocomplete size='small' 
      value={bird.cage}
      onChange={(event: any, newValue: any) => {
        if (newValue !== null) { // Check if newValue is not null
          setBird(prev => ({
            ...prev,
            cage: newValue
          }));
        } else {
          // Handle the case when the value is cleared
          setBird(prev => ({
            ...prev,
            cage: { label: '', value: '' }
          }));
        }
      }}
      options={cages} fullWidth
      renderInput={(params) => <TextField  sx={{ background: 'white' }} {...params} error={errorConditions.cage} label="Cage *" />}
    />

    <Stack direction='row' className='justify-end' spacing={2}>
      <Button variant='contained' component={Link} to='/master-data/bird'>Cancel</Button>
      <Button variant='contained' color='success' onClick={add}>Create</Button>
    </Stack>
    </Stack>
    
    </Stack> 
    <Snackbar open={successNotify} autoHideDuration={3000} onClose={()=>{setSuccessNotify(false)}} anchorOrigin={{vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={()=>{setSuccessNotify(false)}}
          severity="success" variant="filled" sx={{ width: '100%' }}>
          Create successfully
        </Alert>
      </Snackbar>
    <Snackbar open={failNotify} autoHideDuration={3000} onClose={()=>{setFailNotify(false)}} anchorOrigin={{vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={()=>{setFailNotify(false)}}
          severity="error" variant="filled" sx={{ width: '100%' }}>
          Create failed
        </Alert>
      </Snackbar>
    </div>
}