import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { apiUrl } from "../../utils/api";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let isMounted = true;

    fetch(apiUrl("/accounts/session/"), {
      credentials: "include",
    })
      .then(async (response) => {
        if (!isMounted) return;
        if (!response.ok) {
          setStatus("unauthorized");
          return;
        }

        const payload = await response.json();
        setStatus(payload.authenticated ? "authorized" : "unauthorized");
      })
      .catch(() => {
        if (isMounted) {
          setStatus("unauthorized");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (status === "loading") {
    return null;
  }

  if (status === "unauthorized") {
    return <Navigate to="/Login" replace />;
  }

  return children;
}
