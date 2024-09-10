import { useContext, createContext, type PropsWithChildren } from "react";
import { useStorageState } from "./useStorageState";
import axios from "axios";

const AuthContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  session?: string | null;
  userId?: string | null;
  username?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  userId: null,
  username: null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [[isLoading2, userId], setUserId] = useStorageState("userId");
  const [[isLoading3, username], setUsername] = useStorageState("username");

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          // Perform sign-in logic here
          const SIGNIN_URL = "https://be-suwit.ruhyadi.com/api/v1/auth/login";
          axios
            .post(SIGNIN_URL, {
              username: "JohnDoe",
              password: "password",
            })
            .then((response) => {
              console.log(response.data);
              setSession(response.data.access_token);

              const SELF_URL = "https://be-suwit.ruhyadi.com/api/v1/users/self";
              // user session as bearer token
              axios
                .get(SELF_URL, {
                  headers: {
                    Authorization: `Bearer ${response.data.access_token}`,
                  },
                })
                .then((response) => {
                  console.log(response.data);
                  setUserId(response.data.id);
                  setUsername(response.data.username);
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        },
        signOut: () => {
          setSession(null);
        },
        session,
        userId,
        username,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
