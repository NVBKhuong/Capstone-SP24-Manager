import { useAppDispatch, useAppSelector } from 'app/store';
import { useEffect } from 'react';
import { getMenuSamples, selectMenuSamples, selectMenuSamplesList } from './store/menuSamplesSlice';
import MenuSampleCard from './card/MenuSampleCard';
import MenuSampleDialog from './dialog/MenuSampleDialog';
import MealItemDialog from './dialog/MealItemDialog';

export default function MenuSampleContent() {
    const dispatch = useAppDispatch()
    const menuSamples = useAppSelector(selectMenuSamplesList)
    // console.log("menuSample", menuSamples)
    useEffect(() => {
        dispatch(getMenuSamples({}))
    }
        , [])
    return (
        <div>
            <MenuSampleDialog menuSampleList={menuSamples} />
            <MealItemDialog/>
            <div className="grid grid-cols-4 gap-32 p-20">
                {menuSamples?.map((menuSample) => (
                    <div key={menuSample.id}>
                        
                        <MenuSampleCard menuSample={menuSample} />
                    </div>
                ))}
            </div>
        </div>
    )
}
