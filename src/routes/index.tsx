import React from "react";  
import { Switch, Route} from "react-router-dom";
import Home from "../pages/Home";
import Bancos from "../pages/Bancos";
import Page404 from "../pages/page404";
import Direcionamentos from "../pages/Direcionamentos";
import { GastosGerais } from "../pages/GastosGerais";
import { Depositos } from "../pages/Depositos";
import Transferencias from "../pages/Transferencias";
import AddBancos from "../pages/AddBancos";

export default function Routes(): JSX.Element {

  return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/bancos" component={Bancos} />
        <Route exact path="/direcionamentos" component={Direcionamentos} />
        <Route exact path="/gastos-gerais" component={GastosGerais} />
        <Route exact path="/depositos" component={Depositos} />
        <Route exact path="/transferencias" component={Transferencias} />
        <Route exact path="/bancos/add" component={AddBancos} />

        <Route path="*" component={Page404} />
      </Switch>
  );
}