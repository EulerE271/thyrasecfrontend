import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import theme from "../../../utils/MuiTheme";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import InfoIcon from "@mui/icons-material/Info";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Assuming you want a vertical menu icon
import { IconButton } from "@mui/material";

export default function DataTable() {
  const columns: GridColDef[] = [
    // Actions column, assuming you will fill in the renderCell method appropriately.

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
              onClick={() => navigate(`/user/${params.row.id}`)}
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
      field: "account_number",
      headerName: "Account Number",
      width: 150,
      renderCell: (params) => (
        <Link
          to={`/user/${params.row.account_holder_id}`} // Construct the link path
          onClick={(e) => e.stopPropagation()}
          style={{ textDecoration: "underline" }}
        >
          {params.value}
        </Link>
      ),
    },
    { field: "account_name", headerName: "Account Name", width: 150 },
    { field: "account_type_name", headerName: "Account Type", width: 130 },
    {
      field: "account_balance",
      headerName: "Balance",
      width: 130,
      type: "number",
    },
    { field: "account_currency", headerName: "Currency", width: 90 },
    { field: "account_status", headerName: "Status", width: 120 },
    { field: "account_holder_id", headerName: "Account Holder ID", width: 220 },
    // Add other fields as needed...
  ];

  const [data, setData] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("/v1/accounts", {
          withCredentials: true,
        });
        setData(result.data);
      } catch (error) {
        console.error("Failed to fetch accounts", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {" "}
      {/* Wrap the outermost div with ThemeProvider */}
      <div>
        <DataGrid
          rows={data}
          columns={columns}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.primary.light, // Set the background color for headers
            },
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
          checkboxSelection
          getRowId={(row) => row.id} // Use the 'uuid' property as the unique identifier
        />
      </div>
    </ThemeProvider>
  );
}
