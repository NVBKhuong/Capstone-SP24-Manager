import TabPanel from '@mui/lab/TabPanel';
import FoodData from './FoodData';
import FoodReport from './FoodReport';
export default function TabContent(){
    return <div className="w-full flex flex-col min-h-full">
    <TabPanel value="1"><FoodData/></TabPanel>
    <TabPanel value="2"><FoodReport/></TabPanel>
    </div>
}