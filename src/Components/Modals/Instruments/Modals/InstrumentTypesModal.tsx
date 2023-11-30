// InstrumentTypesModal.tsx
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

interface InstrumentTypesModalProps {
  open: boolean;
  onClose: () => void;
  onSelectInstrumentType: (typeId: number, typeName: string) => void;
}

const InstrumentTypesModal: React.FC<InstrumentTypesModalProps> = ({
  open,
  onClose,
  onSelectInstrumentType,
}) => {
  const [InstrumentTypes, setInstrumentTypes] = useState<
    { id: number; type_name: string }[] | null
  >(null);

  useEffect(() => {
    if (open) {
      axios
        .get("http://localhost:8082/v1/fetch/types/asset", {
          withCredentials: true,
        })
        .then((response) => {
          setInstrumentTypes(response.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Instrument Type</DialogTitle>
      <DialogContent>
        {InstrumentTypes ? (
          <TableContainer component={Paper}>
            <Table aria-label="Instrument Types">
              <TableBody>
                {InstrumentTypes.map((type) => (
                  <TableRow
                    key={type.id}
                    onClick={() =>
                      onSelectInstrumentType(type.id, type.type_name)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{type.id}</TableCell>
                    <TableCell>{type.type_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p>Loading instrument types...</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InstrumentTypesModal;
