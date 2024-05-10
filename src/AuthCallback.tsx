import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export default function AuthCallback() {
  const searchParams = useSearchParams()[0];
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      throw new Error(`Internal auth error: ${error}`);
    }

    const authResponse = new URLSearchParams(location.hash.slice(1));
    const state = authResponse.get("state");
    if (!state) {
      throw new Error("state parameter missing");
    }

    const service = new URLSearchParams(state).get("service");
    if (!service) {
      throw new Error("service parameter missing");
    }

    const accessToken = authResponse.get("access_token");
    if (!accessToken) {
      throw new Error("access_token missing in auth response");
    }

    localStorage.setItem(`${service}:access_token`, accessToken);

    navigate("/");
  }, [location, searchParams, navigate]);

  return <div>Doing auth...</div>;
}
