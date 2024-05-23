import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router'

export default function MealPlanDetailHeader() {
    const navigate = useNavigate()
    return (
        <div>
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center"
                className="bg-gray-500 h-[200px] py-14"
            > <Typography fontWeight={600} fontSize={60}>
                    Plan detail
                </Typography>
                <Button onClick={() => navigate(-1)}
                    variant="outlined"  color="secondary">
                    Back to Calendar
                </Button>
            </Box>

        </div>
    )
}
