import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { Menu, MenuItem } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Assuming you want a vertical menu icon
import { IconButton } from "@mui/material";
import theme from "../../../utils/MuiTheme";

type Transaction = {
  id: number;
  owner_id: number;
  account_owner_id: number;
  type: number;
  asset1_id: number;
  asset2_id: number;
  account_asset1_id: number;
  account_asset2_id: number;
  amount_asset1: number;
  amount_asset2: number;
  created_by_id: number;
  updated_by_id: number;
  created_at: string;
  updated_at: string;
  corrected: boolean;
  canceled: boolean;
  settlement_transaction_id: number;
  trade_transaction_id: number;
  status_transaction: number;
  comment: string | null;
  owner_name: string;
  type_name: string;
  account_asset1_account_name: string;
  account_asset2_account_name: string;
  order_no: string;
};

const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  // Define the columns for your DataGrid
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
      field: "order_no",
      headerName: "Order Number",
      width: 150,
      renderCell: (params) => (
        <Link
          to={`/transaction/${params.row.id}`} // Construct the link path
          onClick={(e) => e.stopPropagation()}
          style={{ textDecoration: "underline" }}
        >
          {params.value}
        </Link>
      ),
    },
    { field: "owner_name", headerName: "Owner Name", width: 200 },
    { field: "type_name", headerName: "Type", width: 130 },
    {
      field: "amount_asset1",
      headerName: "Asset 1 Amount",
      width: 130,
      type: "number",
    },
    {
      field: "amount_asset2",
      headerName: "Asset 2 Amount",
      width: 130,
      type: "number",
    },
    { field: "created_at", headerName: "Timestamp", width: 180 },
    { field: "corrected", headerName: "Corrected", width: 120 },
    { field: "canceled", headerName: "Canceled", width: 120 },
    // Add other columns as necessary
  ];

  // Fetch transactions from the API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("/v1/transactions", {
          withCredentials: true,
        });
        if (response.data && Array.isArray(response.data)) {
          setTransactions(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <DataGrid
        rows={transactions}
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
        getRowId={(row) => row.id}
        // Add additional properties and event handlers as needed
      />
    </div>
  );
};

export default TransactionList;
