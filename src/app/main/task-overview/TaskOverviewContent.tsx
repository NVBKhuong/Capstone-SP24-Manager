import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';  
import Typography from '@mui/material/Typography';
import {useEffect, useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';
import { useAppDispatch,useAppSelector } from 'app/store';
import axios from 'src/app/auth/services/api/customAxios';
import { Link } from 'react-router-dom';

const container = {
	show: {
		transition: {
			staggerChildren: 0.1
		}
	}
};
const TaskOverviewContent = ()=>{
  const [staffs, setStaffs] = useState([])
  const loadStaffs=async()=>{
    try {
      const res = await axios.get('/staffs')
      if(res.data) setStaffs(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    loadStaffs()
  },[])
    return <motion.div
    className="items-center flex grid grid-cols-1  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-32 mt-32 sm:mt-40 ms-32"
    variants={container} initial="hidden" animate="show" >
    {staffs.length>0 && staffs.map(staff => <Card key={staff.id} style={{ textDecoration: 'none', color: 'inherit' }} component={Link} to={`/task-overview/user/${staff.id}`} >
      <CardHeader
        avatar={<Avatar alt="Avatar" src={staff.avatarUrl}/>} sx={{ maxWidth: 'fit-content' }}
        title={staff.name} />
    </Card>)}
    </motion.div>
}
export default TaskOverviewContent