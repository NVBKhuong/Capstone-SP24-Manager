import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useAppDispatch, useAppSelector } from 'app/store';

const TaskManagementHeader = ()=>{
    
    return <div style={{background:'rgb(241, 245, 249)'}} className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-24 md:px-32">
    <motion.span
        initial={{ x: -20 }}
        animate={{ x: 0, transition: { delay: 0.2 } }}
    >
        <Typography className="text-24 md:text-32 font-extrabold tracking-tight">Task overview</Typography>
    </motion.span>
    <motion.div  initial={{ opacity: 0, x: 20 }}  animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}>
        <Stack direction="row" spacing={2}>
            <Button variant="contained" color="secondary" startIcon={<FuseSvgIcon>heroicons-outline:search</FuseSvgIcon>}
            >Search</Button>

        </Stack>
        </motion.div>
</div>
}
export default TaskManagementHeader   