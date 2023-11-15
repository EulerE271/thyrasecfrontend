// AccountTypesModal.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

interface AccountTypesModalProps {
  open: boolean;
  onClose: () => void;
  onSelectTransactionType: (typeId: number, typeName: string) => void; // Change here
}

const AccountTypesModal: React.FC<AccountTypesModalProps> = ({
  open,
  onClose,
  onSelectTransactionType,
}) => {
  const [AccountTypes, setAccountTypes] = useState<
    { id: number; account_type_name: string }[] | null
  >(null);

  useEffect(() => {
    if (open) {
      axios
        .get("v1/account-types", {
          withCredentials: true,
        })
        .then((response) => {
          setAccountTypes(response.data); // Assuming response.data is an array of objects
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Transaction Type</DialogTitle>
      <DialogContent>
        {AccountTypes ? (
          <TableContainer component={Paper}>
            <Table aria-label="Transaction Types">
              <TableBody>
                {AccountTypes.map((type) => (
                  <TableRow
                    key={type.id}
                    onClick={() =>
                      onSelectTransactionType(type.id, type.account_type_name)
                    } // Change here
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{type.id}</TableCell>
                    <TableCell>{type.account_type_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p>Loading transaction types...</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AccountTypesModal;
