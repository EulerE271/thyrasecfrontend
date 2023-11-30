// src/pages/Home.tsx

import React, { useState } from "react";
import OrdersTable from "../../Components/Tables/Orders/OrderTable";
import CreateOrderModal from "../../Components/Modals/Orders/Modal/CreateOrder/CreateOrderModal";
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
