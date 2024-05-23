import { Box, Tabs, Tab, Typography } from '@mui/material'
import React, { useState } from 'react'
import PropTypes from 'prop-types';


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`
  };
}
export const menuMeals: menuMeal[] =
  [
    {
      id: "1",
      name: "Morning"
    },
    {
      id: "2",
      name: "Lunch"
    },
    {
      id: "3",
      name: "Afternoon"
    },
    {
      id: "4",
      name: "Evening"
    },
  ]
export type menuMeal = {
  id: string;
  name: string;
}
export default function FoodNormTab() {

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {menuMeals.map(
            menuMeal =>
              <Tab key={menuMeal.id} label={menuMeal.name} {...a11yProps(0)} />
          )}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        Item One
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        Item Four
      </CustomTabPanel>
    </Box>

  )
}
