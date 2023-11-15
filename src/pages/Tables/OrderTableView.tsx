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

  const handleCreateOrder = async (orderData: any) => {
    try {
      // Send a POST request to the server to create a new order
      const response = await axios.post("v1/orders/create", {
        account_id: orderData.accountId,
        asset_id: orderData.assetId,
        order_type: orderData.orderType,
        quantity: orderData.quantity,
        price_per_unit: orderData.pricePerUnit,
        total_amount: orderData.quantity * orderData.pricePerUnit, // Assuming total_amount needs to be calculated
        status: "created", // Assuming the initial status is always 'created'
      }, {withCredentials: true});

      // Check the response if needed
      if (response.data) {
        // Handle the response. For example, show a success message
        alert("Order created successfully");

        // Optionally, refresh the orders list
        // fetchOrders(); // If you have a method to fetch orders
      }
    } catch (error) {
      console.error("Failed to create order", error);
      // Handle errors, e.g., show an error message
      alert("Error creating order");
    }
  };

  return (
    <>
      <Button onClick={handleOpenCreateModal}>Create Order</Button>

      <OrdersTable />
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        handleClose={handleCloseCreateModal}
        handleSubmit={handleCreateOrder}
      />
    </>
  );
};

export default OrderTableView;
