import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#e5f1ff',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#e5f1ff',
      main: '#e5f1ff',
      dark: '#ba000d',
      contrastText: '#000',
    },
    background: {
        default: '#fff', // Set the global background color here
      },
  },
});

export default theme