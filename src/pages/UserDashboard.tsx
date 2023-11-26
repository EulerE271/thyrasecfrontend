import React, { useEffect, useState } from "react";
import { Container, Grid, Paper } from "@mui/material";
import PerformanceGraph from "../components/graphs/PerformanceGraph";
import CustomerAccountModule, {
  Account,
} from "../components/user/modules/CustomerAccountModule";
import CustomerTransactionModule from "../components/user/modules/CustomerTransactionModule";
import CustomerPositionModule from "../components/user/modules/CustomerPositionModule";
import { useParams } from "react-router-dom";
import axios from "axios";
import AccountSummary from "../components/user/modules/AccountSummary";

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
        <Grid item xs={12}>
          {aggregatedData && (
            <AccountSummary
              totalValue={aggregatedData.TotalValue}
              totalCash={aggregatedData.TotalCash}
              assetValue={aggregatedData.AssetValue}
              availableCash={aggregatedData.AvailableCash}
            />
          )}
          <Paper>
            <PerformanceGraph />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <CustomerAccountModule
              accounts={accounts}
              onAccountCreated={handleAccountCreated}
            />
            <CustomerTransactionModule accountIds={accountIds} />{" "}
            {/* Pass account IDs */}
            <CustomerPositionModule accounts={accounts} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserDashboard;
