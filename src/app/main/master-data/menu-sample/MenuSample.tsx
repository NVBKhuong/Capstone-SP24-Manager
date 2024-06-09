import FusePageCarded from '@fuse/core/FusePageCarded';
import MenuSampleContent from './MenuSampleContent';
import MenuSampleHeader from './MenuSampleHeader';
import { useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { getCareMode, getSpecies } from '../../meal-plan/meal-plan-detail/store/menusSlice';



function MenuSample() {
    const dispatch = useAppDispatch()
    useEffect(
        () => {
            dispatch(getSpecies())
            dispatch(getCareMode())
        }
        , []
    )
    return (<FusePageCarded
        header={<MenuSampleHeader />}
        content={<MenuSampleContent />}

    />)
}

export default MenuSample;
