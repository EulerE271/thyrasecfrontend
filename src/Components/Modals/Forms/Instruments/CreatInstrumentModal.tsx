import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import InstrumentTypesModal from "../../Instruments/Modals/InstrumentTypesModal";

interface NewInstrumentModalProps {
  open: boolean;
  onClose: () => void;
  onInstrumentCreated: (newInstrument: any) => void; // Replace 'any' with the actual type
}


const NewInstrumentModal: React.FC<NewInstrumentModalProps> = ({
  open,
  onClose,
  onInstrumentCreated,
}) => {
  const [instrumentName, setInstrumentName] = useState<string | null>(null);
  const [isin, setIsin] = useState<string | null>(null);
  const [ticker, setTicker] = useState<string | null>(null);
  const [exchange, setExchange] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string | null>(null);
  const [instrumentType, setInstrumentType] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [volume, setVolume] = useState<number | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [sector, setSector] = useState<string | null>(null);
  const [assetTypeId, setAssetTypeId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isInstrumentTypesModalOpen, setIsInstrumentTypesModalOpen] =
    useState(false);



    
  const handleCreateNewInstrument = () => {
    setError("");
    setSubmitting(true);

    axios
      .post(
        "http://localhost:8084/v1/create/instruments",
        {
          instrument_name: instrumentName,
          isin: isin,
          ticker: ticker,
          exchange: exchange,
          currency: currency,
          instrument_type: instrumentType,
          current_price: currentPrice,
          volume: volume,
          country: country,
          sector: sector,
          asset_type_id: assetTypeId,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        onInstrumentCreated(response.data);
        setInstrumentName(null);
        setIsin(null);
        setTicker(null);
        setExchange(null);
        setCurrency(null);
        setInstrumentType(null);
        setCurrentPrice(null);
        setVolume(null);
        setCountry(null);
        setSector(null);
        setAssetTypeId(null);
        onClose();
      })
      .catch((err) => {
        console.error(err);
        setError("An error occurred while creating the instrument");
        setSubmitting(false);
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Instrument</DialogTitle>
      <DialogContent>
        <TextField
          label="Instrument Name"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2, marginTop: 2 }}
          value={instrumentName || ""}
          onChange={(e) => setInstrumentName(e.target.value)}
        />
        <Button
          onClick={() => setIsInstrumentTypesModalOpen(true)}
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
        >
          {instrumentType || "Select Instrument Type"}
        </Button>

        <TextField
          label="ISIN"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
          value={isin || ""}
          onChange={(e) => setIsin(e.target.value)}
        />
        <TextField
          label="Ticker"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
          value={ticker || ""}
          onChange={(e) => setTicker(e.target.value)}
        />
        <TextField
          label="Exchange"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
          value={exchange || ""}
          onChange={(e) => setExchange(e.target.value)}
        />
        <TextField
          label="Currency"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
          value={currency || ""}
          onChange={(e) => setCurrency(e.target.value)}
        />
        <TextField
          label="Instrument Type"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
          value={instrumentType || ""}
          onChange={(e) => setInstrumentType(e.target.value)}
        />
        <TextField
          label="Current Price"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
          type="number"
          value={currentPrice || ""}
          onChange={(e) => setCurrentPrice(Number(e.target.value))}
        />
        <TextField
          label="Volume"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
          type="number"
          value={volume || ""}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <TextField
          label="Country"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
          value={country || ""}
          onChange={(e) => setCountry(e.target.value)}
        />
        <TextField
          label="Sector"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
          value={sector || ""}
          onChange={(e) => setSector(e.target.value)}
        />
        <InstrumentTypesModal
          open={isInstrumentTypesModalOpen}
          onClose={() => setIsInstrumentTypesModalOpen(false)}
          onSelectInstrumentType={(typeId, typeName) => {
            setInstrumentType(typeName);
            setAssetTypeId(typeId);
            setIsInstrumentTypesModalOpen(false);
          }}          
        />
      </DialogContent>
      {error && <p className="text-center">{error}</p>}

      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleCreateNewInstrument}
          variant="contained"
          color="primary"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewInstrumentModal;
