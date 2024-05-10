import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { setToken } from "./store/connectionsSlice";

export default function AuthCallback() {
  const searchParams = useSearchParams()[0];
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();

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

    if (service != "twitch" && service != "spotify") {
      throw new Error("Unrecognized service parameter: " + service);
    }

    const accessToken = authResponse.get("access_token");
    if (!accessToken) {
      throw new Error("access_token missing in auth response");
    }

    dispatch(setToken({ service, token: accessToken }));
    navigate("/");
  }, [location, searchParams, navigate, dispatch]);

  return <div>Doing auth...</div>;
}
