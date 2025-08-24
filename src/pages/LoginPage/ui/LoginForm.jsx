import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";

export default function LoginForm({ name, onSubmit, defaultValue, isPending }) {
  const { control, handleSubmit } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => {
        return (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400, margin: "auto" }}>
              <Typography variant="h4">Login</Typography>
              <TextField
                label="Username"
                value={field.value?.username || ""}
                onChange={(e) => {
                  field.onChange(Object.assign({}, field.value, { username: e.target.value }));
                }}
              />
              <TextField
                label="Password"
                type="password"
                value={field.value?.password || ""}
                onChange={(e) => {
                  field.onChange(Object.assign({}, field.value, { password: e.target.value }));
                }}
              />

              <Button type="submit" variant="contained" disabled={isPending}>
                {isPending ? <CircularProgress size={24} /> : "Login"}
              </Button>
            </Box>
          </form>
        );
      }}
    />
  );
}
