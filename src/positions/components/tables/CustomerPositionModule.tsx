import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Assuming you want a vertical menu icon
import { IconButton } from "@mui/material";
import { Account } from "../../../accounts/components/tables/CustomerAccountModule";
import { formatCurrency } from "../../../common/utils/FormatCurrency";

export interface Row {
  id: string;
  accountId: string;
  assetId: string;
  quantity: number;
  instrumentName: string;
  isin: string;
  ticker: string;
  exchange: string;
  currency: string;
  instrumentType: string;
  currentPrice: number;
  volume: number;
  country: string;
  sector: string;
  assetTypeId: string;
  createdAt: string;
  updatedAt: string;
}

interface BasicTableProps {
  accounts: Account[]; // Assuming 'Account' is the type for your account data
}

export default function BasicTable({ accounts }: BasicTableProps) {
  const [rows, setRows] = useState<Row[]>([]);
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
    { field: "instrumentName", headerName: "Instrument Name", width: 150 },
    { field: "isin", headerName: "ISIN", width: 120 },
    { field: "currency", headerName: "Currency", width: 100 },
    { field: "instrumentType", headerName: "Instrument Type", width: 120 },
    { field: "quantity", headerName: "Quantity", width: 100, type: "number" },
    {
      field: "totalValue",
      headerName: "Total Value",
      width: 150,
      valueFormatter: (params) => formatCurrency(params.value), // Assuming you have a function to format the currency
    }
  ];    // Add other columns as necessary


  useEffect(() => {
    const fetchHoldingsForAccount = async (accountId: string) => {
      try {
        const response = await axios.get(`/v1/account/${accountId}/holdings`, {
          withCredentials: true,
        });
        if (response.data && Array.isArray(response.data)) {
          return response.data.map((item) => ({
            id: item.Holding.ID,
            accountId: item.Holding.AccountID,
            assetId: item.Holding.AssetID,
            quantity: item.Holding.Quantity,
            instrumentName: item.Asset.instrument_name,
            isin: item.Asset.ISIN,
            ticker: item.Asset.Ticker,
            exchange: item.Asset.Exchange,
            currency: item.Asset.Currency,
            instrumentType: item.Asset.InstrumentType,
            currentPrice: item.Asset.CurrentPrice,
            volume: item.Asset.Volume,
            country: item.Asset.Country,
            sector: item.Asset.Sector,
            assetTypeId: item.Asset.AssetTypeId,
            createdAt: item.Asset.CreatedAt,
            updatedAt: item.Asset.UpdatedAt,
            totalValue: item.Holding.Quantity * item.Asset.CurrentPrice // Calculate total value
          }));
        }
        return [];
      } catch (error) {
        console.error(
          `Error fetching holdings for account ${accountId}:`,
          error
        );
        return [];
      }
    };

    const fetchAllHoldings = async () => {
      const allHoldingsPromises = accounts.map((account) =>
        fetchHoldingsForAccount(account.id.toString())
      );
      const allHoldingsResults = await Promise.all(allHoldingsPromises);
      setRows(allHoldingsResults.flat());
    };

    if (accounts.length > 0) {
      fetchAllHoldings();
    } else {
      setRows([]);
    }
  }, [accounts]);

  return (
    <div>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}
