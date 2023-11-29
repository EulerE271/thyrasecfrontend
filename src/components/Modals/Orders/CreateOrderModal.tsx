import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  Alert,
} from "@mui/material";
import InstrumentSelectionModal from "../Instruments/InstrumentDisplayModal"; // Adjust the path as necessary
import AccountSelectionModal from "../Accounts/AccountsDisplayModal"; // Adjust the path as necessary
import axios from "axios";

interface CreateOrderModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

interface OrderDetails {
  orderType: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  instrumentID: string;
  userID: string;
  accountID: string;
  instrument: any;
  account: string;
  comment: string;
}
interface OrderErrors {
  quantity?: string;
  pricePerUnit?: string;
  instrument?: string;
  account?: string;
  orderType?: any;
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  handleClose,
}) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    orderType: "buy",
    quantity: 0,
    userID: "",
    pricePerUnit: 0.0,
    totalAmount: 0.0,
    instrumentID: "",
    accountID: "",
    instrument: "",
    account: "",
    comment: "",
  });
  const [error, setError] = useState("");
  const [isInstrumentModalOpen, setIsInstrumentModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [errors, setErrors] = useState<OrderErrors>({});
  const [isDiscrepancy, setIsDiscrepancy] = useState(false);
  const [manualTotalAmount, setManualTotalAmount] = useState(false); // New state to track if totalAmount was manually set

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const newValue =
      name === "quantity" || name === "pricePerUnit" || name === "totalAmount"
        ? Number(value)
        : value;

    setOrderDetails({ ...orderDetails, [name]: newValue });
    setErrors({ ...errors, [name]: "" });

    if (
      name === "quantity" ||
      name === "pricePerUnit" ||
      name === "totalAmount"
    ) {
    }
  };

  const validateForm = () => {
    const newErrors: OrderErrors = {};
    if (orderDetails.quantity <= 0)
      newErrors.quantity = "Please enter a valid quantity.";
    if (orderDetails.pricePerUnit <= 0)
      newErrors.pricePerUnit = "Please enter a valid price per unit.";
    if (!orderDetails.instrument)
      newErrors.instrument = "Please select an instrument.";
    if (!orderDetails.account) newErrors.account = "Please select an account.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async () => {
    if (validateForm()) {
      console.log(orderDetails);
      let endpoint = "";
      if (orderDetails.orderType == "buy") {
        endpoint = "buy";
      } else if (orderDetails.orderType == "sell") {
        endpoint = "sell";
      } else {
        console.log("undefined ordertyp");
      }

      try {
        const response = await axios.post(
          `v1/orders/create/${endpoint}`,
          {
            owner_id: orderDetails.userID,
            account_id: orderDetails.accountID,
            asset_id: orderDetails.instrumentID,
            order_type: orderDetails.orderType,
            quantity: Number(orderDetails.quantity),
            price_per_unit: Number(orderDetails.pricePerUnit),
            total_amount: orderDetails.quantity * orderDetails.pricePerUnit,
            status: "created",
          },
          { withCredentials: true }
        );

        if (response.data) {
          handleClose();
        }
      } catch (err) {
        setError(`Error creating order: ${err}`);
        console.error("Failed to create order", err);
      }
    }
  };

  const handleInstrumentSelect = (instrument: any) => {
    setOrderDetails({
      ...orderDetails,
      instrument: instrument.isin + " - " + instrument.instrument_name,
      instrumentID: instrument.id,
    });
    setIsInstrumentModalOpen(false);
  };

  const handleAccountSelect = (account: any) => {
    setOrderDetails({
      ...orderDetails,
      account: account.account_number + " - " + account.account_name,
      accountID: account.id, // assuming the UUID field is named 'uuid'
      userID: account.account_holder_id,
    });
    console.log(orderDetails);
    setIsAccountModalOpen(false);
  };

  useEffect(() => {
    // Auto-update totalAmount only if it wasn't manually set
    if (!manualTotalAmount) {
      const calculatedTotal = orderDetails.quantity * orderDetails.pricePerUnit;
      setOrderDetails((prevDetails) => ({
        ...prevDetails,
        totalAmount: calculatedTotal,
      }));
    }
  }, [orderDetails.quantity, orderDetails.pricePerUnit, manualTotalAmount]);

  useEffect(() => {
    const calculatedTotal = orderDetails.quantity * orderDetails.pricePerUnit;
    setIsDiscrepancy(calculatedTotal !== orderDetails.totalAmount);
  }, [
    orderDetails.totalAmount,
    orderDetails.quantity,
    orderDetails.pricePerUnit,
  ]);

  const handleTotalAmountChange = (e: any) => {
    setManualTotalAmount(true); // Set flag to true as totalAmount is manually changed
    setOrderDetails({ ...orderDetails, totalAmount: Number(e.target.value) });
  };

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Create New Order</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          {isDiscrepancy && (
            <Alert severity="warning">
              There is a discrepancy in the total amount.
            </Alert>
          )}

          <FormControl fullWidth error={!!errors.orderType} margin="dense">
            <Select
              name="orderType"
              value={orderDetails.orderType}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="buy">Buy</MenuItem>
              <MenuItem value="sell">Sell</MenuItem>
            </Select>
            <FormHelperText>{errors.orderType}</FormHelperText>
          </FormControl>
          <TextField
            error={!!errors.quantity}
            helperText={errors.quantity}
            margin="dense"
            name="quantity"
            label="Quantity"
            type="number"
            fullWidth
            variant="outlined"
            value={orderDetails.quantity}
            onChange={handleChange}
          />
          <TextField
            error={!!errors.pricePerUnit}
            helperText={errors.pricePerUnit}
            margin="dense"
            name="pricePerUnit"
            label="Price Per Unit"
            type="number"
            fullWidth
            variant="outlined"
            value={orderDetails.pricePerUnit}
            onChange={handleChange}
          />
          <TextField
            error={!!errors.pricePerUnit}
            helperText={errors.pricePerUnit}
            margin="dense"
            name="orderAmount"
            label="Order Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={orderDetails.totalAmount}
            onChange={handleTotalAmountChange} // Update to use the new handler
          />
          <TextField
            error={!!errors.instrument}
            helperText={errors.instrument}
            margin="dense"
            name="instrument"
            label="Instrument"
            type="text"
            fullWidth
            variant="outlined"
            value={orderDetails.instrument}
            onClick={() => setIsInstrumentModalOpen(true)}
            InputProps={{ readOnly: true }}
          />
          <TextField
            error={!!errors.account}
            helperText={errors.account}
            margin="dense"
            name="account"
            label="Account"
            type="text"
            fullWidth
            variant="outlined"
            value={orderDetails.account}
            onClick={() => setIsAccountModalOpen(true)}
            InputProps={{ readOnly: true }}
          />
          <TextField
            margin="dense"
            name="comment"
            label="Comment"
            type="text"
            fullWidth
            variant="outlined"
            value={orderDetails.comment}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleFormSubmit}>Create</Button>
        </DialogActions>
      </Dialog>
      <InstrumentSelectionModal
        isOpen={isInstrumentModalOpen}
        handleClose={() => setIsInstrumentModalOpen(false)}
        onSelectInstrument={handleInstrumentSelect}
      />
      <AccountSelectionModal
        isOpen={isAccountModalOpen}
        handleClose={() => setIsAccountModalOpen(false)}
        onSelectAccount={handleAccountSelect}
      />
    </>
  );
};

export default CreateOrderModal;
