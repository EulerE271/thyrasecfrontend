import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { Menu, MenuItem } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Assuming you want a vertical menu icon
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NewIntstrument from "../../../Modals/Forms/Instruments/CreatInstrumentModal"; // Make sure this path is correct
import axios from "axios";
import theme from "../../../utils/MuiTheme";
type Instrument = {
  id: number;
  instrument_name: string;
  isin: string;
  ticker: string;
  exchange: string;
  currency: string;
  instrument_type: string;
  current_price: number;
  volume: number;
  country: string;
  sector: string;
};

const InstrumentList: React.FC = () => {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const columns: GridColDef[] = [
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      width: 100,
      renderCell: (params) => {
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(
          null
        );
        const open = Boolean(anchorEl);
        const handleClick = (event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget);
        };
        const handleClose = () => {
          setAnchorEl(null);
        };

        return (
          <React.Fragment>
            <IconButton aria-label="actions" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
            <IconButton
              aria-label="info"
              onClick={() => navigate(`/user/${params.row.uuid}`)}
            >
              <InfoIcon />
            </IconButton>
            <Menu
              id="action-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 1,
                style: {
                  width: "20ch",
                },
              }}
            >
              {/* Add your menu items here */}
              <MenuItem onClick={() => console.log("Edit", params.row.uuid)}>
                Edit
              </MenuItem>
              <MenuItem onClick={() => console.log("Delete", params.row.uuid)}>
                Delete
              </MenuItem>
            </Menu>
          </React.Fragment>
        );
      },
    },

    { field: "id", headerName: "ID", width: 90 },
    { field: "instrument_name", headerName: "Name", width: 200 },
    { field: "isin", headerName: "ISIN", width: 200 },
    { field: "ticker", headerName: "Ticker", width: 130 },
    { field: "exchange", headerName: "Exchange", width: 130 },
    { field: "currency", headerName: "Currency", width: 130 },
    { field: "instrument_type", headerName: "Type", width: 130 },
    { field: "current_price", headerName: "Price", width: 130 },
    { field: "volume", headerName: "Volume", width: 130 },
    { field: "country", headerName: "Country", width: 130 },
    { field: "sector", headerName: "Sector", width: 130 },
  ];

  useEffect(() => {
    axios
      .get("/v1/instruments", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setInstruments(response.data);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch instruments", error);
      });
  }, []);

  const handleCreateClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Button
        onClick={handleCreateClick}
        variant="contained"
        color="primary"
        style={{ margin: "20px" }}
      >
        Create Instrument
      </Button>

      <NewIntstrument
        open={modalOpen}
        onClose={handleCloseModal}
        onInstrumentCreated={(newInstrument: Instrument) => {
          setInstruments((prevInstruments) => [
            ...prevInstruments,
            newInstrument,
          ]);
          handleCloseModal();
        }}
      />

      <div>
        <DataGrid
          rows={instruments}
          columns={columns}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.primary.light, // Set the background color for headers
            },
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
          checkboxSelection
        />
      </div>
    </>
  );
};

export default InstrumentList;
