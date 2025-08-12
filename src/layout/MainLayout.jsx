import { Box, Container, Typography, AppBar, Toolbar, Avatar, Paper } from "@mui/material";
import { Outlet } from "react-router";

function MainLayout() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <AppBar position="static" sx={{ boxShadow: "none" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h5">Javascript + vite + react + MUI</Typography>
          <Avatar sx={{ position: "relative" }} />
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Paper sx={{ py: 2, px: 1 }}>
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
}

export default MainLayout;
