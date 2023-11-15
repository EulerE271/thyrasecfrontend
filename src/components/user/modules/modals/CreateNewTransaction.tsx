import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

interface Account {
  uuid: string; // Adjust according to your account ID type
  account_name: string;
  account_number: string;
  account_balance: number;
  account_currency: string;
}

interface NewTransactionModalProps {
  open: boolean;
  userId: string;
  onClose: () => void;
  onTransactionCreated: (newTransaction: {
    ParentCreditTransactionID: string;
    ParentDebitTransactionID: string;
    message: string;
    // Include other transaction fields as necessary
  }) => void;
}

const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
  open,
  onClose,
  onTransactionCreated,
  userId,
}) => {
  const [transactionType, setTransactionType] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [valueDate, setValueDate] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [depositTypeId, setDepositTypeId] = useState("");
  const [withdrawalTypeId, setWithdrawalTypeId] = useState("");
  const [transactionTypeError, setTransactionTypeError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [transactionDateError, setTransactionDateError] = useState("");
  const [valueDateError, setValueDateError] = useState("");


  useEffect(() => {
    if (open) {
      axios
        .get(`v1/user/${userId}/accounts`, {
          withCredentials: true,
        })
        .then((response) => {
          setAccounts(response.data); // Assuming response.data is an array of accounts
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to fetch accounts");
        });
    }
  }, [userId, open]);

  useEffect(() => {
    if (open) {
      axios
        .get("v1/transaction/types", {
          withCredentials: true,
        })
        .then((response) => {
          const types = response.data;
          const depositType = types.find(
            (type: any) => type.transaction_type_name.toLowerCase() === "deposit"
          );
          const withdrawalType = types.find(
            (type: any) => type.transaction_type_name.toLowerCase() === "withdrawal"
          );

          if (depositType) setDepositTypeId(depositType.type_id);
          if (withdrawalType) setWithdrawalTypeId(withdrawalType.type_id);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to fetch transaction types.");
        });
    }
  }, [open]);

  const handleCreateNewTransaction = () => {
    setError("");
    setSubmitting(true);

    const endpoint =
      transactionType === "Deposit"
        ? "/transaction/create/deposit"
        : "/transaction/create/withdrawal";

    const transactionTypeId =
      transactionType.toLowerCase() === "deposit"
        ? depositTypeId
        : withdrawalTypeId;

    axios
      .post(
        `v1${endpoint}`, // Use the dynamic endpoint
        {
          transaction_owner_id: userId,
          account_owner_id: userId,
          type: transactionTypeId,
          account_asset1_id: "6180267d-06e5-4ca5-833b-7e4980ecc4e1",
          account_asset2_id: selectedAccount,
          account_id: selectedAccount,
          amount_asset1: parseFloat(amount),
          amount_asset2: parseFloat(amount),
          asset1_id: "f9e49e46-3ea2-4091-9560-7e983d43c6f4",
          asset2_id: "31b8d8c5-e981-4301-b8e1-3baf9e6b9b97",
          corrected: false,
          canceled: false,
          status_transaction: "f9e49e46-3ea2-4091-9560-7e983d43c6f4",
          comment: comment,
          trade_date: new Date(transactionDate).toISOString(),
          settlement_date: new Date(valueDate).toISOString(),
        },
        { withCredentials: true }
      )
      .then((response) => {
        onTransactionCreated({
          ParentCreditTransactionID:
            response.data["Parent CreditTransactionID"],
          ParentDebitTransactionID: response.data["Parent debitTransactionID"],
          message: response.data.message,
          // Include other necessary data from the response
        });
        setTransactionType("");

        setSelectedAccount("");
        setAmount("");
        setTransactionDate("");
        setValueDate("");
        onClose();
      })
      .catch((err) => {
        // Check if the error response has data and a specific message
        if (err.response && err.response.data && err.response.data.error) {
          setError(
            `An error occurred while creating the transaction: ${err.response.data.error}`
          );
        } else {
          // Fallback generic error message
          setError(
            `An error occurred while creating the transaction: ${err.message}`
          );
        }
        console.error(err);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const validateTransactionType = (value: string) => {
    if (!value) {
      setTransactionTypeError("Transaction type is required.");
      return false;
    } else {
      setTransactionTypeError("");
      return true;
    }
  };

  const validateAmount = (value: string) => {
    const num = parseFloat(value);
    const selectedAcc = accounts.find((acc) => acc.uuid === selectedAccount);
  
    if (isNaN(num) || num <= 0) {
      setAmountError("Amount must be a positive number.");
      return false;
    } 
    // Check if the transaction type is 'Withdrawal' and amount exceeds account balance
    else if (transactionType === "Withdrawal" && selectedAcc && num > selectedAcc.account_balance) {
      setAmountError("Amount exceeds account balance.");
      return false;
    } else {
      setAmountError("");
      return true;
    }
  };

  const validateTransactionDate = (value: string) => {
    if (!value) {
      setTransactionDateError("Transaction date is required");
      return false;
    } else {
      setTransactionDateError("");
      return true;
    }
  };

  const canSubmit = () => {
    return !transactionTypeError && !amountError && !transactionDateError;
    !valueDateError;
  };

  const validateValueDate = (value: string) => {
    if (!value) {
      setValueDateError("Value date is required");
      return false;
    } else if (new Date(value) < new Date(transactionDate)) {
      setValueDateError(
        "Value date cannot be earlier than the transaction date."
      );
      return false;
    } else {
      setValueDateError("");
      return true;
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Transaction</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 2 }}>
          <InputLabel id="transaction-type-label">Transaction Type</InputLabel>
          <Select
            labelId="transaction-type-label"
            id="transaction-type-select"
            value={transactionType}
            label="Transaction Type"
            onChange={(e) => {
              setTransactionType(e.target.value); // Set the value
              validateTransactionType(e.target.value);
            }}
          >
            <MenuItem value="Deposit">Deposit</MenuItem>
            <MenuItem value="Withdrawal">Withdrawal</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel id="account-label">Account</InputLabel>
          <Select
            labelId="account-label"
            id="account-select"
            value={selectedAccount}
            label="Account"
            onChange={(e) => {
              console.log("Selected account:", e.target.value); // Add this line to log the value
              setSelectedAccount(e.target.value as string);
            }}
          >
            {accounts && accounts.length > 0 ? (
              accounts.map((account) => (
                <MenuItem key={account.uuid} value={account.uuid}>
                  {account.account_number} - {account.account_name} -{" "}
                  {account.account_currency} {account.account_balance}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="">No Accounts Available</MenuItem>
            )}
          </Select>
        </FormControl>

        <TextField
          label="Amount"
          variant="outlined"
          fullWidth
          error={Boolean(amountError)}
          helperText={amountError}
          sx={{ marginBottom: 2 }}
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value); // Set the value
            // Call the validation function to validate the new value
            validateAmount(e.target.value);
          }}
        />

        <TextField
          label="Transaction Date"
          variant="outlined"
          fullWidth
          error={Boolean(transactionDateError)}
          helperText={transactionDateError}
          sx={{ marginBottom: 2 }}
          value={transactionDate}
          onChange={(e) => {
            setTransactionDate(e.target.value);
            validateTransactionDate(e.target.value);
            // Re-validate valueDate when transactionDate changes
            if (valueDate) validateValueDate(valueDate);
          }}
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          label="Value Date"
          variant="outlined"
          fullWidth
          error={Boolean(valueDateError)}
          helperText={valueDateError}
          sx={{ marginBottom: 2 }}
          value={valueDate}
          onChange={(e) => {
            setValueDate(e.target.value);
            validateValueDate(e.target.value); // Validate the value date against the transaction date
          }}
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Comment"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </DialogContent>
      {error && <p className="text-center">{error}</p>}
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleCreateNewTransaction}
          variant="contained"
          color="primary"
          disabled={!canSubmit() || submitting}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewTransactionModal;
