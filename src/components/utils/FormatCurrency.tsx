// utils.js or utils.ts

export const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('sv-SE', { // You can change 'en-US' to your local preference
      style: 'currency',
      currency: 'SEK', // Change 'USD' to your desired currency code
    });
  };
  