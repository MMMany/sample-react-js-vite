import { Box, Container, Typography, AppBar, Toolbar, Avatar, Paper, Button, Stack } from "@mui/material";
import { Outlet } from "react-router";
import useAuthStore from "#/stores/auth";

function MainLayout() {
  const { accessToken, logout } = useAuthStore();

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <AppBar position="static" sx={{ boxShadow: "none" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h5">Javascript + vite + react + MUI</Typography>
          <Stack direction="row" spacing={2}>
            {accessToken && (
              <Button sx={{ color: "white" }} onClick={logout}>
                Logout
              </Button>
            )}
            <Avatar sx={{ position: "relative" }} />
          </Stack>
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
