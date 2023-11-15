// Tabs.tsx
import React, { useState } from "react";
import { Tabs, Tab, Box, styled } from "@mui/material";

// Styled components
const StyledTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    backgroundColor: "#38b2ac", // Custom indicator color
  },
});

const StyledTab = styled(Tab)({
  fontWeight: "bold",
  "&:hover": {
    color: "#38b2ac", // Custom hover color
  },
  "&.Mui-selected": {
    color: "#38b2ac", // Custom selected color
  },
});

// TabPanel function
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

// InstrumentTabs component
const InstrumentTabs: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="bg-gray-500">
      <StyledTabs
        value={value}
        onChange={handleChange}
        aria-label="instrument tabs"
      >
        <StyledTab label="Stocks" />
        <StyledTab label="Funds" />
        <StyledTab label="Bonds" />
      </StyledTabs>
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
