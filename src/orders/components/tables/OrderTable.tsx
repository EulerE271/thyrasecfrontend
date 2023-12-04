import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import theme from "../../../common/utils/MuiTheme";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import InfoIcon from "@mui/icons-material/Info";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton } from "@mui/material";
import ConfirmationModal from "../../../common/components/modals/ConfirmModal";
import SettlementModal from "../forms/SettlementModal";

interface Order {
  id: string;
  // Include other properties of the order as needed
}

export default function OrdersTable() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [orders, setOrders] = React.useState([]);
  const [nextStatus, setNextStatus] = React.useState("");
  const [settlementModalOpen, setSettlementModalOpen] = React.useState(false);
  const [selectedOrderForSettlement, setSelectedOrderForSettlement] =
    React.useState(null);

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

        let additionalMenuItem;
        if (params.row.order_type === "ca271242-eb64-46ff-bb7e-8d15a80db4d9") {
          switch (params.row.status) {
            case "created":
              additionalMenuItem = (
                <MenuItem
                  onClick={() => handleOpenModal(params.row, "confirm")}
                >
                  Confirm
                </MenuItem>
              );
              break;
            case "confirmed":
              additionalMenuItem = (
                <MenuItem
                  onClick={() => handleOpenModal(params.row, "execute")}
                >
                  Execute
                </MenuItem>
              );
              break;
            case "executed":
              additionalMenuItem = (
                <MenuItem onClick={() => handleOpenSettlementModal(params.row)}>
                  Settle
                </MenuItem>
              );
              break;
            default:
              additionalMenuItem = null;
          }
        }

        return (
          <React.Fragment>
            <IconButton aria-label="actions" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
            <IconButton
              aria-label="info"
              onClick={() => navigate(`/order/${params.row.id}`)}
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
              {additionalMenuItem}
              <MenuItem
                onClick={() => console.log("Cancel Order", params.row.id)}
              >
                Cancel Order
              </MenuItem>
            </Menu>
          </React.Fragment>
        );
      },
    },
    // ... other columns as per your order structure
    { field: "order_type", headerName: "Order Type", width: 130 },
    { field: "quantity", headerName: "Quantity", width: 100 },
    { field: "price_per_unit", headerName: "Price Per Unit", width: 150 },
    { field: "total_amount", headerName: "Total Amount", width: 150 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "instrument_name", headerName: "Instrument", width: 120 },
    { field: "instrument_type", headerName: "Type", width: 100 },
    { field: "account_number", headerName: "Owner", width: 120 },
    // Add more columns as needed...
  ];

  const handleOpenModal = (order: any, status: string) => {
    setSelectedOrder(order);
    setNextStatus(status);
    setIsModalOpen(true);
  };

  const handleOpenSettlementModal = (order: any) => {
    setSelectedOrderForSettlement(order); // Set the selected order for settlement
    setSettlementModalOpen(true); // Open the settlement modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchOrders();
  };

  const fetchOrders = async () => {
    try {
      const result = await axios.get("/v1/orders", {
        withCredentials: true,
      });
      setOrders(result.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);



  const handleUpdateStatus = async (orderId: any, newStatus: any) => {
    try {
      await axios.put(
        `/v1/orders/${orderId}/${newStatus}`,
        { status: newStatus },
        { withCredentials: true }
      );
      // Refresh data or notify user
      // Optionally, refresh orders list to reflect the changes
    } catch (error) {
      console.error("Failed to update order status", error);
    }
    fetchOrders();
  };

  const handleConfirmAction = () => {
    if (selectedOrder) {
      handleUpdateStatus(selectedOrder.id, nextStatus);
    }
    fetchOrders();
    setIsModalOpen(false);
  };

  const handleSettlementComplete = (settlementDetails: any) => {
    console.log("Settlement completed:", settlementDetails);
    fetchOrders();
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <div>
          <DataGrid
            rows={orders}
            columns={columns}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.primary.light,
              },
              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
              },
            }}
            checkboxSelection
            getRowId={(row) => row.id} // Assuming 'id' is the unique identifier for orders
          />
        </div>
      </ThemeProvider>
      <ConfirmationModal
        isOpen={isModalOpen}
        handleClose={handleCloseModal}
        title={`Confirm ${
          nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)
        } Action`}
        content={`Are you sure you want to ${nextStatus} this order?`}
        onConfirm={handleConfirmAction}
      />
      <SettlementModal
        open={settlementModalOpen}
        order={selectedOrderForSettlement}
        onClose={() => setSettlementModalOpen(false)}
        onSettlementComplete={handleSettlementComplete}
      />
    </>
  );
}
