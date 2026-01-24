import React from "react";
import { Switch, Route } from "react-router-dom";
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
import EditGastosGerais from "../pages/EditGastosGerais";
import EditDeposito from "../pages/EditDeposito";
import EditTransferencia from "../pages/EditTransferencia";
import AddUsuario from "../pages/AddUsuario";
import Login from "../pages/Login";
import EnviaPorPlanilha from "../pages/EnviaPorPlanilha";
import UserPage from "../pages/UserPage";
import SubscriptionPage from "../pages/SubscriptionPage";
import PoliPriv from "../pages/PoliPriv";
import {
  ProtectedRoute,
  OnlySubscribersRoute,
} from "../components/AuthProvider";
import RecuperaSenha from "../pages/RecuperaSenha";
import RecuperaSenhaEmail from "../pages/RecuperaSenhaEmail";

export default function Routes(): JSX.Element {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route
        exact
        path="/recuperar-senha-email"
        component={RecuperaSenhaEmail}
      />
      <Route
        exact
        path="/recuperar-senha/:id/:token"
        component={RecuperaSenha}
      />
      <Route exact path="/cadastro" component={AddUsuario} />
      <Route exact path="/politica-de-privacidade" component={PoliPriv} />

      {/* Protected Routes */}
      <Route
        exact
        path="/bancos"
        component={(props: any) => (
          <ProtectedRoute>
            <Bancos {...props} />
          </ProtectedRoute>
        )}
      />
      <Route
        exact
        path="/categorias"
        component={(props: any) => (
          <ProtectedRoute>
            <Categorias {...props} />
          </ProtectedRoute>
        )}
      />
      <Route
        exact
        path="/gastos-gerais"
        component={(props: any) => (
          <OnlySubscribersRoute>
            <GastosGerais {...props} />
          </OnlySubscribersRoute>
        )}
      />
      <Route
        exact
        path="/depositos"
        component={(props: any) => (
          <OnlySubscribersRoute>
            <Depositos {...props} />
          </OnlySubscribersRoute>
        )}
      />
      <Route
        exact
        path="/transferencias"
        component={(props: any) => (
          <ProtectedRoute>
            <Transferencias {...props} />
          </ProtectedRoute>
        )}
      />
      <Route
        exact
        path="/bancos/add"
        component={(props: any) => (
          <ProtectedRoute>
            <AddBancos {...props} />
          </ProtectedRoute>
        )}
      />
      <Route
        exact
        path="/categorias/add"
        component={(props: any) => (
          <ProtectedRoute>
            <AddCategorias {...props} />
          </ProtectedRoute>
        )}
      />
      <Route
        exact
        path="/gastos-gerais/add"
        component={(props: any) => (
          <ProtectedRoute>
            <AddGastosGerais {...props} />
          </ProtectedRoute>
        )}
      />

      <Route
        exact
        path="/gastos/edit/:id"
        component={(props: any) => (
          <ProtectedRoute>
            <EditGastosGerais {...props} />
          </ProtectedRoute>
        )}
      />

      <Route
        exact
        path="/depositos/add"
        component={(props: any) => (
          <ProtectedRoute>
            <AddDeposito {...props} />
          </ProtectedRoute>
        )}
      />
      <Route
        exact
        path="/depositos/edit/:id"
        component={(props: any) => (
          <ProtectedRoute>
            <EditDeposito {...props} />
          </ProtectedRoute>
        )}
      />
      <Route
        exact
        path="/transferencias/add"
        component={(props: any) => (
          <ProtectedRoute>
            <AddTransferencia {...props} />
          </ProtectedRoute>
        )}
      />
      <Route
        exact
        path="/transferencias/edit/entre-bancos/:id"
        component={(props: any) => (
          <ProtectedRoute>
            <EditTransferencia tipoTransferencia="entre-bancos" />
          </ProtectedRoute>
        )}
      />
      <Route
        exact
        path="/transferencias/edit/entre-categorias/:id"
        component={(props: any) => (
          <ProtectedRoute>
            <EditTransferencia tipoTransferencia="entre-categorias" />
          </ProtectedRoute>
        )}
      />
      <Route
        exact
        path="/envia-por-planilha"
        component={(props: any) => (
          <OnlySubscribersRoute>
            <EnviaPorPlanilha {...props} />
          </OnlySubscribersRoute>
        )}
      />
      <Route
        exact
        path="/perfil"
        component={(props: any) => (
          <ProtectedRoute>
            <UserPage {...props} />
          </ProtectedRoute>
        )}
      />
      <Route
        exact
        path="/assinatura"
        component={(props: any) => (
          <ProtectedRoute>
            <SubscriptionPage {...props} />
          </ProtectedRoute>
        )}
      />

      <Route path="*" component={Page404} />
    </Switch>
  );
}
