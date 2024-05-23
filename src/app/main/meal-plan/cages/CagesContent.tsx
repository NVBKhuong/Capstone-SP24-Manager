import { useThemeMediaQuery } from '@fuse/hooks';
import { FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/store';
import React, { useEffect, useState } from 'react'
import { getCages, selectCages } from '../store/cagesSlice';
import { CageType } from './type/CageType';
import { motion } from 'framer-motion';
import _ from 'lodash';
import CageCard from './component/CageCard';
const container = {
    show: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: {
        opacity: 0,
        y: 20
    },
    show: {
        opacity: 1,
        y: 0
    }
};
export default function CagesContent() {
    const dispatch = useAppDispatch();
    const cages = useAppSelector(selectCages);
    const materials = cages?.map(cage => cage.material)


    const [filteredData, setFilteredData] = useState<CageType[]>([]);
    const [searchText, setSearchText] = useState('');
    const [selectedMaterial, setSelectedMaterial] = useState('all');
    const [hideCompleted, setHideCompleted] = useState(false);

    useEffect(() => {
        dispatch(getCages());
    }, [dispatch]);

    useEffect(() => {
        function getFilteredArray() {
            if (searchText.length === 0 && selectedMaterial === 'all') {
                return cages;
            }

            return _.filter(cages, (item) => {
                if (selectedMaterial !== 'all' && item.material !== selectedMaterial) {
                    return false;
                }



                return item.name.toLowerCase().includes(searchText.toLowerCase());
            });
        }

        if (cages) {
            setFilteredData(getFilteredArray());
        }
    }, [cages, searchText, selectedMaterial]);

    function handleSelectedMaterial(event) {
        setSelectedMaterial(event.target.value);
    }

    function handleSearchText(event) {
        setSearchText(event.target.value);
    }
    return (
        <div className="flex flex-col flex-1 w-full mx-auto px-24 pt-24 sm:p-40">
            <div className="flex flex-col shrink-0 sm:flex-row items-center justify-between space-y-16 sm:space-y-0">
                <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center space-y-16 sm:space-y-0 sm:space-x-16">
                    <FormControl
                        className="flex w-full sm:w-136"
                        variant="outlined"
                    >
                        <InputLabel id="Material-select-label">Material</InputLabel>
                        <Select
                            labelId="Material-select-label"
                            id="Material-select"
                            label="Material"
                            value={selectedMaterial}
                            onChange={handleSelectedMaterial}
                        >
                            <MenuItem value="all">
                                <em> All </em>
                            </MenuItem>
                            { materials.filter((material, index, self) =>
                                index === self.indexOf(material)
                            ).map((Material) => (
                                <MenuItem
                                    value={Material}
                                    key={Material}
                                >
                                    {Material}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Search for a Cage"
                        placeholder="Enter a keyword..."
                        className="flex w-full sm:w-256 mx-8"
                        value={searchText}
                        inputProps={{
                            'aria-label': 'Search'
                        }}
                        onChange={handleSearchText}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                </div>
{/* 
                <FormControlLabel
                    label="On-off"
                    control={
                        <Switch
                            onChange={(ev) => {
                                setHideCompleted(ev.target.checked);
                            }}
                            checked={hideCompleted}
                            name="hideCompleted"
                        />
                    }
                /> */}
            </div>
            {filteredData &&
                (filteredData.length > 0 ? (
                    <motion.div
                        className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-32 mt-32 sm:mt-40"
                        variants={container}
                        initial="hidden"
                        animate="show"
                    >
                        {filteredData.map((Cage) => {

                            return (
                                <motion.div
                                    variants={item}
                                    key={Cage.id}
                                >

                                    <CageCard cage={Cage} />
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    <div className="flex flex-1 items-center justify-center">
                        <Typography
                            color="text.secondary"
                            className="text-24 my-24"
                        >
                            No cages found!
                        </Typography>
                    </div>
                ))}
        </div>
    )
}
