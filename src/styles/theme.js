import { createTheme } from "@mui/material";

export const mainTheme = createTheme({
  // palette: {},
  components: {
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: "red",
        },
      },
    },
  },
});
