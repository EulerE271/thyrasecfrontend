import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  styled,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "#1a202c", // Custom background color
    color: "white",
    borderRadius: "8px",
  },
  "& .MuiMenuItem-root": {
    "&:hover": {
      backgroundColor: "#2d3748", // Custom hover color
    },
  },
}));

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openOrders, setOpenOrders] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOrders = (event: React.MouseEvent<HTMLElement>) => {
    setOpenOrders((prev) => !prev);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenOrders(false);
  };

  return (
    <AppBar position="static" style={{ backgroundColor: "#2d3748" }}>
      <Toolbar>
        <Typography variant="h6" className="flex-grow">
          Fintech App
        </Typography>
        <Button color="inherit">Dashboard</Button>
        <Button color="inherit" onClick={handleMenu}>
          Instruments
        </Button>
        <Button color="inherit" onClick={handleMenu}>
          Orders
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
          <MenuItem
            onClick={handleOrders}
            onMouseOver={handleOrders}
          >
            Orders
            <StyledMenu
              id="orders-submenu"
              anchorEl={anchorEl}
              keepMounted
              open={openOrders}
              onClose={() => setOpenOrders(false)}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <MenuItem onClick={handleClose}>Trade 1</MenuItem>
              <MenuItem onClick={handleClose}>Trade 2</MenuItem>
              {/* ...more second-level items */}
            </StyledMenu>
          </MenuItem>
        </StyledMenu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
