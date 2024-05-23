import FusePageSimple from '@fuse/core/FusePageSimple'
import MealPlanDetailHeader from './MealPlanDetailHeader'
import MealPlanDetailContent from './MealPlanDetailContent'

export default function MealPlanDetail() {
    return (
        <FusePageSimple
            header={
                    <MealPlanDetailHeader/>
            }
            content={
               <MealPlanDetailContent/> 
            }
        />
    )
}
