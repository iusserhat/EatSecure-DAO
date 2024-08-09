import React from "react";
import { useAuth } from "./use-auth-client";
import ShadowButton from "./components/shadow-button.jsx";
import Stack from "@mui/material/Stack";

function LoggedOut() {
  const { login } = useAuth();

  return (
    <Stack
      margin={1}
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap={3}
    >
      <img src="/logo2.svg" alt="internet" height={80} />
      <ShadowButton onClick={login} />
    </Stack>
  );
}

export default LoggedOut;