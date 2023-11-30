import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';

type AccountSummaryProps = {
  totalValue: number;
  totalCash: number;
  assetValue: number;
  availableCash: number;
};

const AccountSummary: React.FC<AccountSummaryProps> = ({
  totalValue,
  totalCash,
  assetValue,
  availableCash,
}) => {
  const theme = useTheme(); // Using the theme for consistent styling

  // You can customize these styles further to match your design system
  const cardStyle = {
    backgroundColor: theme.palette.grey[100],
    boxShadow: theme.shadows[4],
    borderRadius: theme.shape.borderRadius,
  };

  const titleStyle = {
    fontSize: '1.25rem', // Adjust the size as needed
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
    textAlign: 'center' as const,
  };

  const valueStyle = {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: theme.palette.text.primary,
  };

  const labelStyle = {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
  };

  return (
    <Card sx={cardStyle}>
      <CardContent>
        <Typography sx={titleStyle} gutterBottom>
          Account Summary
        </Typography>
        <Box className="grid grid-cols-2 gap-4">
          {[ // This array can be mapped to reduce redundancy
            { label: 'Total Value', value: totalValue },
            { label: 'Total Cash', value: totalCash },
            { label: 'Asset Value', value: assetValue },
            { label: 'Available Cash', value: availableCash },
          ].map((item, index) => (
            <Box key={index}>
              <Typography sx={labelStyle} component="p">
                {item.label}
              </Typography>
              <Typography sx={valueStyle} component="p">
                {item.value.toLocaleString()} SEK
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AccountSummary;
