import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import NewTransactionModal from "../forms/CreateNewTransaction";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Assuming you want a vertical menu icon
import { IconButton } from "@mui/material";
import { format, parseISO } from "date-fns";

export interface Row {
  id: number;
  owner_id: number;
  account_owner_id: number;
  type: number;
  account_asset1_account_name: string;
  account_asset2_account_name: string;
  owner_name: string;
  type_name: string; // Add the type_name field here
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
  parentDebitTransactionID?: string; // Assuming it's a string; adjust the type as necessary
  corrected: boolean;
  canceled: boolean;
  settlement_transaction_id: number;
  trade_transaction_id: number;
  status_transaction: number;
  order_no: string;
  comment?: string | null;
}

interface BasicTableProps {
  accountIds: string[]; // Accepting an array of account IDs
}
export default function BasicTable({ accountIds }: BasicTableProps) {
  const [rows, setRows] = useState<Row[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    {
      field: "account_number",
      headerName: "Account",
      width: 130,
      type: "string",
    },
    { field: "order_no", headerName: "Order number", width: 150 },
    { field: "status_label", headerName: "Status Transaction", width: 150 },
    {
      field: "transaction_type_name",
      headerName: "Transaction Type",
      width: 130,
    },
    {
      field: "amount_asset2",
      headerName: "Amount",
      width: 130,
      type: "number",
    },
    {
      field: "created_at",
      headerName: "Created At",
      width: 200,
      renderCell: (params) => {
        // Use date-fns to parse and format the date
        const formattedDate = format(
          parseISO(params.row.created_at),
          "yyyy-MM-dd HH:mm"
        );
        return <span>{formattedDate}</span>;
      },
    },
    // Add other columns as necessary
  ];

  useEffect(() => {
    const fetchTransactionsForAccount = async (accountId: string) => {
      try {
        const response = await axios.get(`/v1/user/${accountId}/transactions`, {
          withCredentials: true,
        });
        // Ensure the response is an array and filter out non-object entries
        return Array.isArray(response.data)
          ? response.data.filter(
              (item) => typeof item === "object" && item !== null
            )
          : [];
      } catch (error) {
        console.error(
          `Error fetching transactions for account ${accountId}:`,
          error
        );
        return [];
      }
    };

    const fetchAllTransactions = async () => {
      const allTransactions = await Promise.all(
        accountIds.map((accountId) => fetchTransactionsForAccount(accountId))
      );
      // Flatten and filter out entries without an 'id' property
      setRows(
        allTransactions.flat().filter((item) => item.hasOwnProperty("id"))
      );
    };

    fetchAllTransactions();
  }, [accountIds]);

  const handleTransactionCreated = (newTransaction: any) => {
    setRows((prevRows) => [...prevRows, newTransaction]);
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Create New Transaction
      </Button>

      <NewTransactionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTransactionCreated={handleTransactionCreated}
      />

      <DataGrid
        rows={rows}
        columns={columns}
        // Add additional properties and event handlers as needed
      />
    </div>
  );
}
