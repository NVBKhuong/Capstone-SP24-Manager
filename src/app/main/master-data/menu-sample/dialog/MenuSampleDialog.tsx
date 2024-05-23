import { Autocomplete, TextField } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'app/store'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getCareMode, getSpecies, selectCareModes, selectSpecies } from 'src/app/main/meal-plan/meal-plan-detail/store/menusSlice'
import { NameType, menuSampleType } from 'src/app/main/meal-plan/meal-plan-detail/type/MenuType'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, MenuItem, Select } from '@mui/material';
import { createMenuMealSample, createMenuSample, selectMenuSampleDiaglogOpen, setMenuSampleDialog } from '../store/menuSamplesSlice'
const menuSampleList =
    [
        "High quality", "Low quality"
    ]
type menuSamplesDialogProps = {
    menuSampleList: menuSampleType[]
}
const menuMeals = [
    {
        name: "Morning",
        from: "07:00:00",
        to: "09:00:00"
    },
    {
        name: "Lunch",
        from: "12:0:00",
        to: "14:00:00"
    },
    {
        name: "Afternoon",
        from: "17:00:00",
        to: "19:00:00"
    },
    {
        name: "Evening",
        from: "21:00:00",
        to: "22:00:00"
    }
]
export default function MenuSampleDialog(props: menuSamplesDialogProps) {
    const dispatch = useAppDispatch()

    const open = useAppSelector(selectMenuSampleDiaglogOpen)
    // state 
    const [menuType, setMenuType] = useState("");
    const [selectedSpecies, setSelectedSpecies] = useState(null);
    const [selectedCareMode, setSelectedCareMode] = useState(null)
    const species = useAppSelector(selectSpecies)
    const caremodes = useAppSelector(selectCareModes)
    const { menuSampleList } = props
    // console.log("Check", menuSampleList)
    // get Species && Caremodes list
    useEffect(
        () => {
            dispatch(getSpecies())
            dispatch(getCareMode())
        }
        , []
    )
    function handleClose() {
        dispatch(setMenuSampleDialog(false))
    }
    function isUniqueMenuSample(menuType, selectedSpecies, selectedCareMode) {
        for (let i = 0; i < menuSampleList.length; i++) {
            let menuSample = menuSampleList[i];

            if (
                menuSample.species.id == selectedSpecies &&
                menuSample.name == menuType &&
                menuSample.careMode.id == selectedCareMode) {
                return false;
            }
        }

        return true;
    }
    const handleChange = (event) => {
        setMenuType(event.target.value)
    }
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                component: 'form',
                onSubmit: async (event) => {
                    event.preventDefault()
                    const data = {
                        name: menuType,
                        speciesId: selectedSpecies.id,
                        careModeId: selectedCareMode.id
                    }
                    if (isUniqueMenuSample(data.name, data.speciesId, data.careModeId)) {
                        const result = await dispatch(createMenuSample(data))
                        let promises = menuMeals.map((meal, index) => {
                            const info = {
                                menuSampleId: result.payload.id,
                                name: meal.name,
                                from: meal.from,
                                to: meal.to
                            }
                            const menuMealData = {
                                data: info,
                                menuId: result.payload.id
                            }
                            return dispatch(createMenuMealSample(menuMealData));
                        });

                        Promise.all(promises)
                            .then(() => console.log("All meals have been created"))
                            .catch((error) => console.error(error))
                        handleClose()

                    } else {
                        // handleClose()
                        alert('Menu Sample could not be created. The menu sample must be unique.');
                   }
       
                }
            }}
        >
            <div className="flex justify-center">
                <DialogTitle className=" text-40" >Menu sample </DialogTitle>
            </div>
            <DialogContent>
                <div className="mb-5">
                    <InputLabel className=' mb-2' id="demo-simple-select-label">Type of menu</InputLabel>
                    <Select
                        required
                        value={menuType}
                        onChange={handleChange}
                        className='w-[200px]'
                    >
                        <MenuItem value={"Low quality"}>Low quality</MenuItem>
                        <MenuItem value={"High quality"}>High quality</MenuItem>
                    </Select>
                </div>
                <div className="mb-5">
                    <InputLabel className=' mb-2' id="demo-simple-select-label">Species</InputLabel>
                    <Autocomplete
                        className="  w-512"
                        fullWidth 
                        options={species}
                        getOptionLabel={(options: NameType) => {
                            return options?.name || '';
                        }
                        }
                        onChange={(event, newValue) => setSelectedSpecies(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                required
                                placeholder="Select one "
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        )}
                    />
                </div>
                <div className="mb-5">
                    <InputLabel className=' mb-2' id="demo-simple-select-label">Care mode</InputLabel>
                    <Autocomplete 
                        className=" w-512"
                        fullWidth
                        options={caremodes}
                        getOptionLabel={(options: NameType) => {
                            return options?.name || '';
                        }
                        }
                        onChange={(event, newValue) => setSelectedCareMode(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                required
                                placeholder="Select one "
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        )}
                    />
                </div>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Add</Button>
            </DialogActions>
        </Dialog >
    )

}
