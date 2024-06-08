import { useAppDispatch, useAppSelector } from 'app/store';
import { useEffect, useState } from 'react';
import { getMenuSamples, selectMenuSamples, selectMenuSamplesList, selectedFilterCareMode, selectedFilterSpecies, selectedFilterTypeOfMenu } from './store/menuSamplesSlice';
import MenuSampleCard from './card/MenuSampleCard';
import MenuSampleDialog from './dialog/MenuSampleDialog';
import MealItemDialog from './dialog/MealItemDialog';
import _ from 'lodash';
import { motion } from 'framer-motion'
export default function MenuSampleContent() {
    const dispatch = useAppDispatch()
    const data = useAppSelector(selectMenuSamplesList)
    const [menuSamples, setMenuSamples] = useState([])
    // console.log("menuSample", menuSamples)
    const filterCareMode = useAppSelector(selectedFilterCareMode)
    const filterSpecies = useAppSelector(selectedFilterSpecies)
    const filterType = useAppSelector(selectedFilterTypeOfMenu)
    useEffect(() => {
        dispatch(getMenuSamples({}))
    }
        , [])
    useEffect(() => {
        if (data) {
            const filteredMenuSamples = _.filter(data, (sample) => {
                return (
                    (!filterCareMode || sample.careMode?.name === filterCareMode.name) &&
                    (!filterSpecies || sample.species?.name === filterSpecies.name) &&
                    (!filterType || sample.name === filterType)
                )
            })
            setMenuSamples(filteredMenuSamples);
            console.log("filter", filteredMenuSamples)

        }
    }
        , [data, filterCareMode, filterSpecies, filterType])
    return (
        <div>
            <MenuSampleDialog menuSampleList={menuSamples} />
            <MealItemDialog />
            <div className="grid grid-cols-4 gap-32 p-20">
                {menuSamples?.map((menuSample) => (
                    <motion.div
                        key={menuSample.id}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
                    >
                        <MenuSampleCard menuSample={menuSample} />
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
