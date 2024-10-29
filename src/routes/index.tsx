import React from "react";  
import { Switch, Route} from "react-router-dom";
import Home from "../pages/Home";
import Bancos from "../pages/Bancos";
import Page404 from "../pages/page404";

export default function Routes(): JSX.Element {

  return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/bancos" component={Bancos} />
        <Route path="*" component={Page404} />
      </Switch>
  );
}