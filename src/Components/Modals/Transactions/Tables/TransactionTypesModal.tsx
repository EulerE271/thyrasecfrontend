// TransactionTypesModal.tsx
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

interface TransactionTypesModalProps {
  open: boolean;
  onClose: () => void;
  onSelectTransactionType: (type: string) => void;
}

const TransactionTypesModal: React.FC<TransactionTypesModalProps> = ({
  open,
  onClose,
  onSelectTransactionType,
}) => {
  const [transactionTypes, setTransactionTypes] = useState<
    { id: number; transaction_type_name: string }[] | null
  >(null);

  useEffect(() => {
    if (open) {
      axios
        .get("http://localhost:8082/v1/transaction-types", {
          withCredentials: true,
        })
        .then((response) => {
          setTransactionTypes(response.data); // Assuming response.data is an array of objects
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
        {transactionTypes ? (
          <TableContainer component={Paper}>
            <Table aria-label="Transaction Types">
              <TableBody>
                {transactionTypes.map((type) => (
                  <TableRow
                    key={type.id}
                    onClick={() => onSelectTransactionType(type.transaction_type_name)}
                  >
                    <TableCell>{type.id}</TableCell>
                    <TableCell>{type.transaction_type_name}</TableCell>
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

export default TransactionTypesModal;
