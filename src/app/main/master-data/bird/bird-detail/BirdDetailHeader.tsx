import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useNavigate } from 'react-router';
export default function BirdDetailHeader() {
    const navigate = useNavigate()
    return (<div style={{ background: 'rgb(241, 245, 249)' }} className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-24 px-24 md:px-32">
        <motion.span
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.2 } }}
        >
            <Typography className="text-24 md:text-32 font-extrabold tracking-tight">Bird detail</Typography>
        </motion.span>
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
        >
            <Button onClick={() => { navigate(-1) }}
                variant="contained"
                color="secondary"
                startIcon={<FuseSvgIcon>heroicons-outline:arrow-left</FuseSvgIcon>}
            >Back</Button>
        </motion.div>
    </div>)
}