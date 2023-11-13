// src/components/UserDashboard.tsx

import React from "react";
import { Container, Grid, Paper } from "@mui/material";
import PerformanceGraph from "../components/graphs/PerformanceGraph";
import CustomerAccountModule from "../components/user/modules/CustomerAccountModule";
import CustomerTransactionModule from "../components/user/modules/CustomerTransactionModule";
import { useParams } from "react-router-dom";

const UserDashboard: React.FC = () => {
  const { id } = useParams();

  if (!id) {
    // Handle the situation, e.g., redirect or show an error
    return <div>Invalid account ID</div>;
  }
  
  const userId = +id;

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper>
            <PerformanceGraph />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <CustomerAccountModule userId={userId}/>
            <CustomerTransactionModule accountId={userId} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};


export default UserDashboard;
