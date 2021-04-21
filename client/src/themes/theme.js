import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: "Open Sans, sans-serif",
    fontSize: 14,
    button: {
      textTransform: "none",
      letterSpacing: 0,
      fontWeight: "bold"
    }
  },
  overrides: {
    MuiInput: {
      input: {
        fontWeight: "bold"
      }
    },
    MuiButton: {
      containedSecondary: {
        color: "#3A8DFF"
      }
    }
  },
  palette: {
    primary: { main: "#3A8DFF" },
    secondary: { main: "#FFFFFF" }
  }
});
