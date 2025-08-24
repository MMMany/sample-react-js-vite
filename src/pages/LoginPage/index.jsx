import { Alert } from "@mui/material";
import { Navigate } from "react-router";
import { useForm, FormProvider } from "react-hook-form";
import { LoginForm } from "./ui";
import { useAuthStore } from "#/stores";
import { useLogin } from "./api";

export default function LoginPage() {
  const formMethods = useForm();
  const { isLoggedIn } = useAuthStore();
  const { mutate: login, isPending, isError, error } = useLogin();

  const onSubmit = ({ authInfo }) => {
    console.log(authInfo);
    login(authInfo);
  };

  return isLoggedIn ? (
    <Navigate to="/" replace={true} />
  ) : (
    <FormProvider {...formMethods}>
      <LoginForm
        name="authInfo"
        onSubmit={onSubmit}
        isPending={isPending}
        defaultValue={{ username: "user", password: "password" }}
      />
      {isError && <Alert severity="error">{error.message}</Alert>}
    </FormProvider>
  );
}
