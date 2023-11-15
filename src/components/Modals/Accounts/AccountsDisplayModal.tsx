import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { List, ListItem, ListItemText } from "@mui/material";
import axios from "axios";

interface AccountDisplayProps {
  isOpen: boolean;
  handleClose: () => void;
  onSelectAccount: (account: any) => void;
}

const AccountDisplayModal: React.FC<AccountDisplayProps> = ({
  isOpen,
  handleClose,
  onSelectAccount,
}) => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    if (isOpen) {
      axios
        .get("v1/accounts", { withCredentials: true }) // Adjust endpoint as necessary
        .then((response) => {
          setAccounts(response.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="account-dialog-title"
    >
      <DialogTitle id="account-dialog-title">Select account</DialogTitle>
      <DialogContent>
        <List>
          {accounts.map((account, index) => (
            <ListItem
              button
              key={index}
              onClick={() => {
                onSelectAccount(account); // Pass only the clicked account
                handleClose();
              }}
            >
              <ListItemText
                primary={account.account_number + " - " + account.account_name}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccountDisplayModal;
