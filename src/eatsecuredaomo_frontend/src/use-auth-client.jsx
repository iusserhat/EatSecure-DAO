import { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { canisterId, createActor } from "declarations/eatsecuredaomo_backend/index.js";

const AuthContext = createContext();

const defaultOptions = {
  createOptions: {
    idleOptions: {
      disableIdle: true,
    },
  },
  loginOptions: {
    identityProvider:
      process.env.DFX_NETWORK === "ic"
        ? "https://identity.ic0.app"
        : `http://be2us-64aaa-aaaaa-qaabq-cai.localhost:4943`,
  
  },
};

export const useAuthClient = (options = defaultOptions) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [whoamiActor, setWhoamiActor] = useState(null);

  useEffect(() => {
    const initAuthClient = async () => {
      try {
        const client = await AuthClient.create(options.createOptions);
        setAuthClient(client);
        await updateClient(client);
      } catch (error) {
        console.error("Failed to create AuthClient:", error);
      }
    };

    initAuthClient();
  }, []);

  const login = async () => {
    if (!authClient) {
      console.error("AuthClient is not initialized");
      return;
    }

    try {
      await authClient.login({
        ...options.loginOptions,
        onSuccess: async () => {
          await updateClient(authClient);
        },
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const updateClient = async (client) => {
    try {
      const isAuthenticated = await client.isAuthenticated();
      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const identity = client.getIdentity();
        setIdentity(identity);

        const principal = identity.getPrincipal();
        setPrincipal(principal);

        const actor = await createActor(canisterId, {
          agentOptions: {
            identity,
          },
        });

        setWhoamiActor(actor);

        const result = await actor.signUpWithInternetIdentity();
        console.log("Signup result:", result);
      }
    } catch (error) {
      console.error("Failed to update client:", error);
    }
  };

  const logout = async () => {
    try {
      if (authClient) {
        await authClient.logout();
        setIsAuthenticated(false);
        setIdentity(null);
        setPrincipal(null);
        setWhoamiActor(null);
      }
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return {
    isAuthenticated,
    login,
    logout,
    authClient,
    identity,
    principal,
    whoamiActor,
  };
};

export const AuthProvider = ({ children }) => {
  const auth = useAuthClient();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
