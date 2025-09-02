import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { mainTheme } from "./styles/theme";
import { router } from "./routes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={mainTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
