import * as React from "react";
import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Tabs, Tab, IconButton } from "@mui/material";
import CreateNewUserModal from "../../Modals/Forms/Users/CreateUserModal";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import InfoIcon from "@mui/icons-material/Info";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Assuming you want a vertical menu icon
import theme from "../../utils/MuiTheme";

type User = {
  uuid: string;
  username: string;
  email: string;
  role: "customer" | "advisor" | "admin";
};

const UserList: React.FC = () => {
  const [currentTab, setCurrentTab] = React.useState(0);
  const [users, setUsers] = React.useState<User[]>([]);
  const navigate = useNavigate();
  const [isNewUserModalOpen, setIsNewUserModalOpen] = React.useState(false);

  const columns: GridColDef[] = [
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      width: 100,
      renderCell: (params) => {
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(
          null
        );
        const open = Boolean(anchorEl);
        const handleClick = (event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget);
        };
        const handleClose = () => {
          setAnchorEl(null);
        };

        return (
          <React.Fragment>
            <IconButton aria-label="actions" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
            <IconButton
              aria-label="info"
              onClick={() => navigate(`/user/${params.row.uuid}`)}
            >
              <InfoIcon />
            </IconButton>
            <Menu
              id="action-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 1,
                style: {
                  width: "20ch",
                },
              }}
            >
              {/* Add your menu items here */}
              <MenuItem onClick={() => console.log("Edit", params.row.uuid)}>
                Edit
              </MenuItem>
              <MenuItem onClick={() => console.log("Delete", params.row.uuid)}>
                Delete
              </MenuItem>
            </Menu>
          </React.Fragment>
        );
      },
    },

    {
      field: "customer_number",
      headerName: "Customer Number",
      width: 200,
      renderCell: (params) => (
        <Link
          to={`/user/${params.row.uuid}`}
          style={{ textDecoration: "underline", color: "inherit" }}
        >
          {params.value}
        </Link>
      ),
    },
    { field: "username", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "role", headerName: "Role", width: 130 },
  ];

  const fetchUsers = async () => {
    const roles = ["customer", "advisor", "admin"];

    try {
      const response = await axios.get(`v1/fetch/users?role=${roles[currentTab]}`, { withCredentials: true });
      // Access the "users" key in the response data
      setUsers(
        response.data.users.map((user: any) => ({
          ...user,
          role: roles[currentTab] as "customer" | "advisor" | "admin",
        }))
      );
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  // Call fetchUsers when the component mounts and when currentTab changes
  React.useEffect(() => {
    fetchUsers();
  }, [currentTab]);

  const handleOpenNewUserModal = () => {
    setIsNewUserModalOpen(true);
  };

  const handleCloseNewUserModal = () => {
    setIsNewUserModalOpen(false);
  };

  const handleUserCreated = () => {
    fetchUsers();
  };

  const filteredUsers = users.filter((user) => {
    if (currentTab === 0) return user.role === "customer";
    if (currentTab === 1) return user.role === "advisor";
    if (currentTab === 2) return user.role === "admin";
    return true;
  });

  return (
    <Box>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => setCurrentTab(newValue)}
          aria-label="user roles tabs"
        >
          <Tab label="Customer" />
          <Tab label="Advisor" />
          <Tab label="Admin" />
        </Tabs>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenNewUserModal}
        >
          Create User
        </Button>
      </Box>
      <div style={{ width: "100%" }}>
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          checkboxSelection
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.primary.light, // Set the background color for headers
            },
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
          getRowId={(row) => row.uuid}
        />
      </div>

      <CreateNewUserModal
        open={isNewUserModalOpen}
        onClose={handleCloseNewUserModal}
        onUserCreated={handleUserCreated}
      />
    </Box>
  );
};

export default UserList;
