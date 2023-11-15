import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import InstrumentSelectionModal from "../Instruments/InstrumentDisplayModal"; // Adjust the path as necessary
import AccountSelectionModal from "../Accounts/AccountsDisplayModal"; // Adjust the path as necessary

const CreateOrderModal = ({ isOpen, handleClose, handleSubmit }) => {
  const [orderDetails, setOrderDetails] = useState({
    orderType: "buy",
    quantity: 0,
    pricePerUnit: 0.0,
    instrument: "",
    account: "",
  });

  const [isInstrumentModalOpen, setIsInstrumentModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const handleChange = (e) => {
    setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = () => {
    handleSubmit(orderDetails);
    handleClose();
  };

  const handleInstrumentSelect = (instrument) => {
    console.log(instrument);
    // Assuming instrument object has an 'id' and 'name' field
    setOrderDetails({
      ...orderDetails,
      instrument: instrument.isin + " - " + instrument.instrument_name,
    });
    setIsInstrumentModalOpen(false);
  };

  const handleAccountSelect = (account) => {
    const accountDisplay = account.account_number + " - " + account.account_name;
    setOrderDetails({ ...orderDetails, account: accountDisplay });
    setIsAccountModalOpen(false);
};

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Create New Order</DialogTitle>
        <DialogContent>
          <Select
            name="orderType"
            value={orderDetails.orderType}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="buy">Buy</MenuItem>
            <MenuItem value="sell">Sell</MenuItem>
          </Select>
          <TextField
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
            margin="dense"
            name="instrument"
            label="Instrument"
            type="text"
            fullWidth
            variant="outlined"
            value={orderDetails.instrument}
            onClick={() => setIsInstrumentModalOpen(true)}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            margin="dense"
            name="account"
            label="Account"
            type="text"
            fullWidth
            variant="outlined"
            value={orderDetails.account}
            onClick={() => setIsAccountModalOpen(true)}
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleFormSubmit}>Create</Button>
        </DialogActions>
      </Dialog>
      <InstrumentSelectionModal
        isOpen={isInstrumentModalOpen}
        onClose={() => setIsInstrumentModalOpen(false)}
        onSelectInstrument={handleInstrumentSelect}
      />
      <AccountSelectionModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onSelectAccount={handleAccountSelect}
      />
    </>
  );
};

export default CreateOrderModal;
