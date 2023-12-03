import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import PerformanceGraph from "../analytics/components/performance/PerformanceGraph";
import CustomerAccountModule, {
  Account,
} from "../accounts/components/tables/CustomerAccountModule";
import CustomerTransactionModule from "../transactions/components/tables/CustomerTransactionModule";
import CustomerPositionModule from "../positions/components/tables/CustomerPositionModule";
import { useParams } from "react-router-dom";
import axios from "axios";
import AccountSummary from "../accounts/components/tables/AccountSummary";

type AggregatedAccountData = {
  TotalValue: number;
  TotalCash: number;
  AssetValue: number;
  AvailableCash: number;
};

const UserDashboard: React.FC = () => {
  const { id } = useParams();
  const [accounts, setAccounts] = useState<Account[]>([]); // State for accounts
  const accountIds = accounts.map((account) => account.id.toString());
  const [aggregatedData, setAggregatedData] =
    useState<AggregatedAccountData | null>(null);

  if (!id) {
    return <div>Invalid account ID</div>;
  }

  useEffect(() => {
    axios
      .get(`/v1/user/${id}/accounts`, { withCredentials: true })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setAccounts(response.data);
        } else {
          console.error("Received data is not an array:", response.data);
        }
      })
      .catch((error) => console.error("Error fetching accounts:", error));
    axios
      .get(`/v1/user/${id}/aggregated-values`, { withCredentials: true })
      .then((response) => {
        setAggregatedData(response.data);
      })
      .catch((error) =>
        console.error("Error fetching aggregated account data:", error)
      );
  }, [id]);

  // Define the handleAccountCreated function
  const handleAccountCreated = (newAccount: Account) => {
    setAccounts((prevAccounts) => [...prevAccounts, newAccount]);
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Overview
              </Typography>
              <PerformanceGraph />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          {aggregatedData && (
            <AccountSummary
              totalValue={aggregatedData.TotalValue}
              totalCash={aggregatedData.TotalCash}
              assetValue={aggregatedData.AssetValue}
              availableCash={aggregatedData.AvailableCash}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Details
              </Typography>
              <CustomerAccountModule
                accounts={accounts}
                onAccountCreated={handleAccountCreated}
              />
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transactions
              </Typography>
              <CustomerTransactionModule accountIds={accountIds} />
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Positions
              </Typography>
              <CustomerPositionModule accounts={accounts} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserDashboard;
