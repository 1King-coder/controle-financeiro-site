import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Router } from "react-router-dom";
import history from "./services/history";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <Router history={history}>
    <GoogleOAuthProvider
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ""}
    >
      <App />
    </GoogleOAuthProvider>
  </Router>,
);
