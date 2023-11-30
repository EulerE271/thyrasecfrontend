import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";

interface SettlementModalProps {
  open: boolean;
  order: {
    id: string;
    order_type: string;
    quantity: number;
    price_per_unit: number;
    total_amount: number;
    status: string;
    instrument_name: string;
    instrument_type: string;
    tradeDate: string;
    settlementDate: string;
    account_number: string;
  } | null; // Allow null for safety
  onClose: () => void;
  onSettlementComplete: (settlementDetails: any) => void;
}

const SettlementModal: React.FC<SettlementModalProps> = ({
  open,
  order,
  onClose,
  onSettlementComplete,
}) => {
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [tradeDate, setTradeDate] = useState("");
  const [settlementDate, setSettlementDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [amountMismatchWarning, setAmountMismatchWarning] = useState(false);

  useEffect(() => {
    if (open && order) {
      setPricePerUnit(order.price_per_unit.toString());
      setQuantity(order.quantity.toString());
      setAmount(order.total_amount.toString());
      setComment(""); // Reset comment when modal opens
      setTradeDate(order.tradeDate); // Set initial trade date
      setSettlementDate(order.settlementDate); // Set initial settlement date
    }
  }, [open, order]);

  const handleSettleOrder = () => {
    if (!order) {
      setError("No order selected for settlement.");
      return;
    }

    setError("");
    setSubmitting(true);

    // Convert dates to Date objects and format them
    const formattedTradeDate = new Date(tradeDate).toISOString();
    const formattedSettlementDate = new Date(settlementDate).toISOString();

    const payload = {
      orderId: order.id,
      status: order.status,
      settlementDate: formattedSettlementDate,
      tradeDate: formattedTradeDate,
      quantity: parseFloat(quantity),
      amount: parseFloat(amount),
      comment: comment,
    };

    axios
      .put(`v1/orders/${order.id}/settle`, payload, { withCredentials: true })
      .then((response) => {
        onSettlementComplete(response.data);
        onClose();
      })
      .catch((error) => {
        setError(`An error occurred: ${error.message || "Unknown error"}`);
        console.error("Settlement error:", error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  useEffect(() => {
    const calculatedAmount = parseFloat(pricePerUnit) * parseFloat(quantity);

    if (calculatedAmount !== parseFloat(amount)) {
      setAmountMismatchWarning(true);
    } else {
      setAmountMismatchWarning(false);
    }
  }, [amount, quantity, pricePerUnit]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Settle Order</DialogTitle>
      <DialogContent>
        {amountMismatchWarning && (
          <Alert sx={{ marginBottom: 2 }} severity="warning">
            The amount does not equal Price * Quantity
          </Alert>
        )}

        <TextField
          margin="dense"
          label="Price Per Unit"
          type="number"
          fullWidth
          variant="outlined"
          value={pricePerUnit}
          onChange={(e) => setPricePerUnit(e.target.value)} // Display price per unit from order
        />
        <TextField
          margin="dense"
          label="Quantity"
          type="number"
          fullWidth
          variant="outlined"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Order Amount"
          type="number"
          fullWidth
          variant="outlined"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <TextField
          margin="dense"
          name="tradeDate"
          label="Trade Date"
          type="date"
          fullWidth
          variant="outlined"
          value={tradeDate}
          onChange={(e) => setTradeDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          margin="dense"
          name="settlemenDate"
          label="Settlement Date"
          type="date"
          fullWidth
          variant="outlined"
          value={settlementDate}
          onChange={(e) => setSettlementDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="dense"
          label="Comment"
          fullWidth
          variant="outlined"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSettleOrder}
          variant="contained"
          color="primary"
          disabled={submitting}
        >
          Settle
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettlementModal;
