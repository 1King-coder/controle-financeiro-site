import React from "react";
import Routes from "./routes";
import { Router } from "react-router-dom";
import history from "./services/history";
import GlobalStyles from "./styles/GlobalStyles";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import SideBar from "./components/Sidebar";
import AuthProvider from "./components/AuthProvider";
import AdScript from "./components/AdScript";
import Footer from "./components/Footer";

function App(): JSX.Element {
  return (
    <Router history={history}>
      <AuthProvider>
        <AdScript />
        <Header />
        <div className="AppWrapper">
          <GlobalStyles />
          <ToastContainer autoClose={3000} className={"toast-container"} />
          <Routes />
        </div>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
