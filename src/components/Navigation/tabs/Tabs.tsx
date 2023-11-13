// Tabs.tsx
import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const InstrumentTabs: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <Tabs value={value} onChange={handleChange} aria-label="instrument tabs">
        <Tab label="Stocks" />
        <Tab label="Funds" />
        <Tab label="Bonds" />
      </Tabs>
      <TabPanel value={value} index={0}>
        Stocks Content
      </TabPanel>
      <TabPanel value={value} index={1}>
        Funds Content
      </TabPanel>
      <TabPanel value={value} index={2}>
        Bonds Content
      </TabPanel>
    </div>
  );
};

export default InstrumentTabs;
