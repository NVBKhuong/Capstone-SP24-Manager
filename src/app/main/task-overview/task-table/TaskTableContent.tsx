import Typography from '@mui/material/Typography';
import {useEffect, useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';
import { useAppDispatch,useAppSelector } from 'app/store';
import axios from 'src/app/auth/services/api/customAxios';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
const container = {
	show: {
		transition: {
			staggerChildren: 0.1
		}
	}
};

const taskList = [
  {
    "Hour 1":[
      {
        date: new Date('22/4/2024'),
        taskName: 'task 1'
      },
      {
        date: new Date('23/4/2024'),
        taskName: 'task 1'
      },
      {
        date: new Date('24/4/2024'),
        taskName: 'task 1'
      },
    ],
    "Hour 2":[],
    "Hour 3":[],
    "Hour 4":[],
    "Hour 5":[],
    "Hour 6":[],
    "Hour 7":[],
    "Hour 8":[],
  },
]
const TaskOverviewContent = ({userId})=>{
  const [pickDate, setPickDate] = useState(new Date());
  const [aWeekLater, setAWeekLater] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };
  const handleDateChange = (newValue) => {
    setPickDate(newValue);
  };
  useEffect(() => {
    // Calculate the date a week later
    const newDate = new Date(pickDate);
    newDate.setDate(newDate.getDate() + 7);
    setAWeekLater(newDate);

    // Generate the date range
    const dates = [];
    for (let i = 0; i <= 7; i++) {
      const currentDate = new Date(pickDate);
      currentDate.setDate(currentDate.getDate() + i);
      dates.push(currentDate);
    }
    setDateRange(dates);
  }, [pickDate]);
  
    return <div className="w-full min-h-full bg-white">
      <Stack direction='row' spacing={2} className='my-24 mx-12 items-center'>
      <DatePicker value={pickDate} onChange={handleDateChange} format="dd/MM/yyyy" className="w-full sm:w-auto"
                   slotProps={{
                      textField: {
                        size: 'small',
                        label: 'date',
                        placeholder: 'Choose a date',
                        InputLabelProps: {
                          shrink: true
                        },
                        variant: 'outlined'
                      }
                    }}
                    />
        <Typography>-</Typography>
        <Typography>{aWeekLater ? `${aWeekLater.getDate()}/${aWeekLater.getMonth() + 1}/${aWeekLater.getFullYear()}` : '-'}</Typography>
              </Stack>
    <FuseScrollbars className="grow overflow-x-auto">
<Table className="min-w-xl" aria-labelledby="tableTitle" >
<TableHead style={{background:'rgb(250, 251, 254)'}}>
    <TableRow>
    <TableCell align="left"><span className='font-semibold'>Working time</span></TableCell>
    {dateRange.map((date, index) => (
        <TableCell align="left" key={index}>
          {formatDate(date)}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
  <TableBody>
            {taskList.map((taskHour, hourIndex) => (
              <TableRow key={hourIndex}>
                <TableCell>{`Hour ${hourIndex + 1}`}</TableCell>
                {dateRange.map((date, dateIndex) => (
                  <TableCell key={dateIndex}>
                    {taskHour[dateRange[dateIndex]] &&
                      taskHour[dateRange[dateIndex]].map((task, taskIndex) => (
                        <div key={taskIndex}>{task.taskName}</div>
                      ))}
                    {!taskHour[dateRange[dateIndex]] && "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
    </Table>
</FuseScrollbars>
</div>
}
export default TaskOverviewContent