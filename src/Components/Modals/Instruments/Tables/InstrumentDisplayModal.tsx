import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { List, ListItem, ListItemText } from '@mui/material';
import axios from "axios";

interface InstrumentDisplayProps {
  isOpen: boolean;
  handleClose: () => void;
  onSelectInstrument: (instrument: any) => void;
}

interface Instrument {
  isin: string;
  instrument_name: string;
  details: string;
}

const InstrumentDisplayModal: React.FC<InstrumentDisplayProps> = ({
  isOpen,
  handleClose,
  onSelectInstrument,
}) => {
  const [instruments, setInstruments] = useState<Instrument[]>([]);

  useEffect(() => {
    if (isOpen) {
      axios.get("v1/instruments", { withCredentials: true }) // Adjust endpoint as necessary
        .then(response => {
          setInstruments(response.data);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="instrument-dialog-title"
    >
      <DialogTitle id="instrument-dialog-title">Select Instrument</DialogTitle>
      <DialogContent>
        <List>
          {instruments.map((instrument, index) => (
            <ListItem 
              button 
              key={index} 
              onClick={() => {
                onSelectInstrument(instrument);
                handleClose();
              }}
            >
              <ListItemText primary={instrument.isin + " " + instrument.instrument_name} secondary={instrument.details} />
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

export default InstrumentDisplayModal;
