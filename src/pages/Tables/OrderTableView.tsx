// src/pages/Home.tsx

import React, { useState } from "react";
import OrdersTable from "../../components/Tables/orders/OrderTable";
import CreateOrderModal from "../../components/Modals/Orders/CreateOrderModal";
import { Button } from "@mui/material";
import axios from "axios";

const OrderTableView: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };


  return (
    <>
      <Button onClick={handleOpenCreateModal}>Create Order</Button>

      <OrdersTable />
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        handleClose={handleCloseCreateModal}
      />
    </>
  );
};

export default OrderTableView;
