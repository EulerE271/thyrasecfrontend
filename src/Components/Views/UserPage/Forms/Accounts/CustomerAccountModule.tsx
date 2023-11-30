import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CreateAccountModal from "../../../../Modals/Forms/Accounts/CreateAccountModal";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Define the type for your account data
export interface Account {
  id: number;
  account_name: string;
  account_holder_name: string;
  account_balance: number;
  account_type: number;
  account_owner_company: boolean;
  account_currency: string;
  account_number: string;
  account_opening_date: string;
  account_closing_date: string;
  account_status: string;
  interest_rate: number;
  overdraft_limit: number;
  account_description: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

interface CustomerAccountModuleProps {
  accounts: Account[];
  onAccountCreated: (newAccount: Account) => void;
}

const CustomerAccountModule: React.FC<CustomerAccountModuleProps> = ({ accounts, onAccountCreated }) => {
  const [isAccountModalOpen, setAccountModalOpen] = useState(false);
  const navigate = useNavigate();
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

    { field: "account_number", headerName: "Account Number", width: 130 },
    { field: "account_name", headerName: "Account Name", width: 130 },
    {
      field: "account_balance",
      headerName: "Balance",
      width: 130,
      type: "number",
    },
    { field: "account_type_name", headerName: "Account Type", width: 130 },
    { field: "account_currency", headerName: "Currency", width: 130 },
    { field: "account_status", headerName: "Account Status", width: 130 },
    // Add other columns as necessary
  ];

  const handleAccountCreated = (newAccount: Account) => {
    onAccountCreated(newAccount);
  };
  
  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setAccountModalOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Create New Account
      </Button>

      <CreateAccountModal
        open={isAccountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        onAccountCreated={handleAccountCreated}
      />

      <DataGrid
        rows={accounts}
        columns={columns}
        getRowId={(row) => row.id} // Adjust this if your accounts have a unique identifier
      />
    </div>
  );
};

export default CustomerAccountModule;