import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

type AccountSummaryProps = {
    totalValue: number;
    totalCash: number;
    assetValue: number;
    availableCash: number;
};

const AccountSummary: React.FC<AccountSummaryProps> = ({ totalValue, totalCash, assetValue, availableCash }) => {
    return (
        <Card className="max-w-md mx-auto bg-white shadow-md overflow-hidden md:max-w-2xl">
            <CardContent>
                <Typography className="text-center text-xl font-semibold" color="textSecondary" gutterBottom>
                    Account Summary
                </Typography>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Typography variant="h5" component="h2">
                            Total Value
                        </Typography>
                        <Typography variant="body2" component="p">
                            {totalValue.toLocaleString()} SEK
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="h5" component="h2">
                            Total Cash
                        </Typography>
                        <Typography variant="body2" component="p">
                            {totalCash.toLocaleString()} SEK
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="h5" component="h2">
                            Asset Value
                        </Typography>
                        <Typography variant="body2" component="p">
                            {assetValue.toLocaleString()} SEK
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="h5" component="h2">
                            Available Cash
                        </Typography>
                        <Typography variant="body2" component="p">
                            {availableCash.toLocaleString()} SEK
                        </Typography>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AccountSummary;
