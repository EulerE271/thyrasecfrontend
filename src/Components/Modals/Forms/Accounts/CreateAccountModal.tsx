// NewAccountModal.tsx

import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useParams } from "react-router-dom";
import AccountTypesModal from "../../Accounts/AccountTypes/Modal/AccountTypesModal";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface NewAccountModalProps {
  open: boolean;
  onClose: () => void;
  onAccountCreated: (newAccount: any) => void; // Replace 'any' with the actual type
}

const NewAccountModal: React.FC<NewAccountModalProps> = ({
  open,
  onClose,
  onAccountCreated,
}) => {
  // useState hooks for all fields
  const [accountName, setAccountName] = useState<string>("");
  const [accountType, setAccountType] = useState<number>(0);
  const [accountOwnerCompany, setAccountOwnerCompany] =
    useState<boolean>(false);
  const [accountCurrency, setAccountCurrency] = useState<string>("");
  const [accountStatus, setAccountStatus] = useState<string>("");
  const [interestRate, setInterestRate] = useState<number | null>(null);
  const [overdraftLimit, setOverdraftLimit] = useState<number | null>(null);
  const [accountDescription, setAccountDescription] = useState<string | null>(
    null
  );
  const [isAccountTypesModalOpen, setIsAccountTypesModalOpen] =
    useState<boolean>(false);
  const [accountTypeName, setAccountTypeName] = useState<string>("");
  /*const [AccountTypes, setAccountTypes] = useState<
    { id: number; transaction_type_name: string }[]
  >([]);*/

  const [accountNameError, setAccountNameError] = useState("");
  const [accountTypeError, setAccountTypeError] = useState("");
  const [accountCurrencyError, setAccountCurrencyError] = useState("");
  const [accountStatusError, setAccountStatusError] = useState("");
  const [interestRateError, setInterestRateError] = useState("");
  const [overdraftLimitError, setOverdraftLimitError] = useState("");

  const { id } = useParams();

  const handleCreateNewAccount = () => {
    // Construct the data to send
    const accountData = {
      account_name: accountName,
      account_type: accountType,
      account_owner_company: accountOwnerCompany,
      account_currency: accountCurrency,
      account_status: accountStatus,
      interest_rate: interestRate,
      overdraft_limit: overdraftLimit,
      account_description: accountDescription,
      account_holder_id: id,
    };

    // Post the data
    axios
      .post("v1/create/account", accountData, {
        withCredentials: true,
      })
      .then((response) => {
        onAccountCreated(response.data); // Notify the parent component of the newly created account
        onClose(); // Close the modal
      })
      .catch((error) => {
        console.error("Error creating the account:", error);
        // Handle the error, maybe show a message to the user
      });
  };

  const openAccountTypesModal = () => {
    setIsAccountTypesModalOpen(true);
  };

  const closeAccountTypesModal = () => {
    setIsAccountTypesModalOpen(false);
  };

  // Validation functions
  const validateAccountName = (value: string) => {
    if (!value.trim()) {
      setAccountNameError("Account name is required.");
      return false;
    } else {
      setAccountNameError("");
      return true;
    }
  };

  const validateAccountType = (value: number) => {
    if (accountType === 0) {
      console.log(value)
      setAccountTypeError("Account type is required.");
      return false;
    } else {
      setAccountTypeError("");
      return true;
    }
  };

  const validateAccountCurrency = (value: string) => {
    if (!value.trim()) {
      setAccountCurrencyError("Account currency is required.");
      return false;
    } else {
      setAccountCurrencyError("");
      return true;
    }
  };

  const validateAccountStatus = (value: string) => {
    if (!value) {
      setAccountStatusError("Account status is required.");
      return false;
    } else {
      setAccountStatusError("");
      return true;
    }
  };

  const validateInterestRate = (value: number | null) => {
    // Assuming that the interest rate can be zero or a positive number
    if (value !== null && (isNaN(value) || value < 0)) {
      setInterestRateError("Interest rate must be a positive number or zero.");
      return false;
    } else {
      setInterestRateError("");
      return true;
    }
  };

  const validateOverdraftLimit = (value: number | null) => {
    // Assuming that there is no restriction on overdraft limit (can be positive, zero, or negative)
    if (value !== null && isNaN(value)) {
      setOverdraftLimitError("Overdraft limit must be a number.");
      return false;
    } else {
      setOverdraftLimitError("");
      return true;
    }
  };

  // Call validation functions on value changes
 /* const handleAccountNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setAccountName(value);
    validateAccountName(value);
  };

  const handleAccountCurrencyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setAccountCurrency(value);
    validateAccountCurrency(value);
  }; */

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Account</DialogTitle>
      <DialogContent>
        {/* Account Name Field */}
        <TextField
          label="*Account Name"
          variant="outlined"
          fullWidth
          error={Boolean(accountNameError)}
          helperText={accountNameError}
          sx={{ marginBottom: 2, marginTop: 2 }}
          onChange={(e) => {
            const value = e.target.value;
            setAccountName(value);
            if (!value.trim()) {
              setAccountNameError("Account name is required.");
            } else {
              setAccountNameError("");
            }
          }}
        />

        {/* Account Type Field */}
        <TextField
          label="*Account Type"
          variant="outlined"
          fullWidth
          error={Boolean(accountTypeError)}
          helperText={accountTypeError}
          sx={{ marginBottom: 2 }}
          onClick={openAccountTypesModal} // This should trigger the modal to open
          value={accountTypeName}
          InputProps={{
            readOnly: true,
          }}
        />

        {/* Account Currency Field */}
        <TextField
          label="*Account Currency"
          variant="outlined"
          fullWidth
          error={Boolean(accountCurrencyError)}
          helperText={accountCurrencyError}
          sx={{ marginBottom: 2 }}
          onChange={(e) => {
            const value = e.target.value;
            setAccountCurrency(value);
            if (!value.trim()) {
              setAccountCurrencyError("Account currency is required.");
            } else {
              setAccountCurrencyError("");
            }
          }}
        />

        {/* Account Status Field */}
        <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
          <InputLabel id="account-status-label">*Account Status</InputLabel>
          <Select
            labelId="account-status-label"
            id="account-status-select"
            value={accountStatus}
            onChange={(e) => {
              const value = e.target.value;
              setAccountStatus(value);
              if (!value) {
                setAccountStatusError("Account status is required.");
              } else {
                setAccountStatusError("");
              }
            }}
            label="*Account Status"
          >
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="Locked">Locked</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </Select>
        </FormControl>

        {/* Interest Rate Field */}
        <TextField
          label="Interest Rate"
          variant="outlined"
          fullWidth
          type="number"
          sx={{ marginBottom: 2 }}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            setInterestRate(value);
            // Assuming interest rate can be optional or has a range
            if (isNaN(value) || value < 0) {
              setInterestRateError("Interest rate must be a positive number.");
            } else {
              setInterestRateError("");
            }
          }}
        />

        {/* Overdraft Limit Field */}
        <TextField
          label="Overdraft Limit"
          variant="outlined"
          fullWidth
          type="number"
          sx={{ marginBottom: 2 }}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            setOverdraftLimit(value);
            // Assuming overdraft can be optional or has a range
            if (isNaN(value)) {
              setOverdraftLimitError("Overdraft limit must be a number.");
            } else {
              setOverdraftLimitError("");
            }
          }}
        />

        {/* Description Field */}
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          sx={{ marginBottom: 2 }}
          onChange={(e) => setAccountDescription(e.target.value)}
        />

        {/* Owner is Company Switch */}
        <FormControlLabel
          control={
            <Switch
              checked={accountOwnerCompany}
              onChange={(e) => setAccountOwnerCompany(e.target.checked)}
            />
          }
          label="*Owner is Company?"
          sx={{ marginBottom: 2 }}
        />

        <AccountTypesModal
          open={isAccountTypesModalOpen}
          onClose={closeAccountTypesModal}
          onSelectTransactionType={(typeId, typeName) => {
            setAccountType(typeId);
            setAccountTypeName(typeName);
            closeAccountTypesModal();
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            // Call a function that checks if all validations are passed and then call handleCreateNewAccount
            if (
              validateAccountName(accountName) &&
              validateAccountType(accountType) &&
              validateAccountCurrency(accountCurrency) &&
              validateAccountStatus(accountStatus) &&
              validateInterestRate(interestRate) &&
              validateOverdraftLimit(overdraftLimit)
              // Add other validations if needed
            ) {
              handleCreateNewAccount();
            }
          }}
          variant="contained"
          color="primary"
          disabled={Boolean(
            accountNameError ||
              accountTypeError ||
              accountCurrencyError ||
              accountStatusError ||
              interestRateError ||
              overdraftLimitError
            // Add other error checks if needed
          )}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewAccountModal;
