import { Box, Theme, Typography } from "@mui/material";
import { motion } from 'framer-motion';
export default function CagesHeader() {
    return (
        <Box
            className="relative  overflow-hidden flex shrink-0 items-center justify-center px-16 py-32 md:p-64"
            sx={{
                backgroundColor: 'primary.main',
                color: (theme: Theme) => theme.palette.getContrastText(theme.palette.primary.main)
            }}
        >
            <div className="flex flex-col items-center justify-center  mx-auto w-full">
              
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0 } }}
                >
                    <Typography
                        color="inherit"
                        className="text-center text-24 sm:text-48 font-extrabold tracking-tight mt-4"
                    >
                        Choose cage for planing
                    </Typography>
                </motion.div>
        
            </div>

            <svg
                className="absolute inset-0 pointer-events-none"
                viewBox="0 0 960 540"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMax slice"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g
                    className="text-gray-700 opacity-25"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="100"
                >
                    <circle
                        r="234"
                        cx="196"
                        cy="23"
                    />
                    <circle
                        r="234"
                        cx="790"
                        cy="491"
                    />
                </g>
            </svg>
        </Box>
    )
}