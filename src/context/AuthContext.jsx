import { createContext, useContext, useEffect, useState } from "react";
import { getLocalStorageWithExpiry } from "../helpers/auth/auth.helper.js";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const storedAuth = getLocalStorageWithExpiry("auth");

      if (storedAuth && storedAuth.data && storedAuth.data.token) {
        const token = storedAuth.data.token;

        try {
          const res = await fetch(
            `${import.meta.env.VITE_APP_BACKEND_URL}/users/profile`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const result = await res.json();

          if (res.status === 200 && result.success) {
            setAuth({
              user: result.data, 
              token,
            });
          } else {
            localStorage.removeItem("auth");
            setAuth({
              user: null,
              token: "",
            });
          }
        } catch (error) {
          console.error("Error validating token:", error);
          localStorage.removeItem("auth");
          setAuth({
            user: null,
            token: "",
          });
        }
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
