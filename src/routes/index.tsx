import React from "react";  
import { Switch, Route} from "react-router-dom";
import Home from "../pages/Home";
import Bancos from "../pages/Bancos";
import Page404 from "../pages/page404";
import Categorias from "../pages/Categorias";
import { GastosGerais } from "../pages/GastosGerais";
import { Depositos } from "../pages/Depositos";
import Transferencias from "../pages/Transferencias";
import AddBancos from "../pages/AddBancos";
import AddCategorias from "../pages/AddCategorias";
import AddGastosGerais from "../pages/AddGastosGerais";
import AddDeposito from "../pages/AddDeposito";
import AddTransferencia from "../pages/AddTransferencia";
import AddUsuario from "../pages/AddUsuario";
import Login from "../pages/Login";
import { ProtectedRoute } from "../components/AuthProvider";

export default function Routes(): JSX.Element {

  return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/cadastro" component={AddUsuario} />
        
        {/* Protected Routes */}
        <Route exact path="/bancos" component={(props: any) => (
          <ProtectedRoute>
            <Bancos {...props} />
          </ProtectedRoute>
        )} />
        <Route exact path="/categorias" component={(props: any) => (
          <ProtectedRoute>
            <Categorias {...props} />
          </ProtectedRoute>
        )} />
        <Route exact path="/gastos-gerais" component={(props: any) => (
          <ProtectedRoute>
            <GastosGerais {...props} />
          </ProtectedRoute>
        )} />
        <Route exact path="/depositos" component={(props: any) => (
          <ProtectedRoute>
            <Depositos {...props} />
          </ProtectedRoute>
        )} />
        <Route exact path="/transferencias" component={(props: any) => (
          <ProtectedRoute>
            <Transferencias {...props} />
          </ProtectedRoute>
        )} />
        <Route exact path="/bancos/add" component={(props: any) => (
          <ProtectedRoute>
            <AddBancos {...props} />
          </ProtectedRoute>
        )} />
        <Route exact path="/categorias/add" component={(props: any) => (
          <ProtectedRoute>
            <AddCategorias {...props} />
          </ProtectedRoute>
        )} />
        <Route exact path="/gastos-gerais/add" component={(props: any) => (
          <ProtectedRoute>
            <AddGastosGerais {...props} />
          </ProtectedRoute>
        )} />

        <Route exact path="/depositos/add" component={(props: any) => (
          <ProtectedRoute>
            <AddDeposito {...props} />
          </ProtectedRoute>
        )} />
        <Route exact path="/transferencias/add" component={(props: any) => (
          <ProtectedRoute>
            <AddTransferencia {...props} />
          </ProtectedRoute>
        )} />

        <Route path="*" component={Page404} />
      </Switch>
  );
}