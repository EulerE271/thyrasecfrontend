// Navbar.tsx
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, styled } from '@mui/material';

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#1a202c', // Custom background color
    color: 'white',
    borderRadius: '8px',
  },
  '& .MuiMenuItem-root': {
    '&:hover': {
      backgroundColor: '#2d3748', // Custom hover color
    },
  },
}));

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" style={{ backgroundColor: '#2d3748' }}> {/* Custom AppBar color */}
      <Toolbar>
        <Typography variant="h6" className="flex-grow">
          Fintech App
        </Typography>
        <Button color="inherit">Dashboard</Button>
        <Button color="inherit" onClick={handleMenu}>
          Instruments
        </Button>
        <StyledMenu
          id="menu-appbar"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Stocks</MenuItem>
          <MenuItem onClick={handleClose}>Funds</MenuItem>
          <MenuItem onClick={handleClose}>Bonds</MenuItem>
        </StyledMenu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
