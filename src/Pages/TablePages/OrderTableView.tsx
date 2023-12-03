// src/pages/Home.tsx

import React, { useState } from "react";
import OrdersTable from "../../orders/components/tables/OrderTable";
import CreateOrderModal from "../../orders/components/forms/CreateOrderModal";
import { Button } from "@mui/material";

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
