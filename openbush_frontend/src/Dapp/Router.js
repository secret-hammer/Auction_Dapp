import React  from "react";
import {HashRouter, Route, Switch}from 'react-router-dom';
import Main from './Main';
import LoginControl from './LoginControl';
import Market from './Market';
import Profile from "./Profile";

const BasicRoute = ()=> (
    <HashRouter>
        <Switch>
            <Route exact path = "/" component={Main}/>
            <Route exact path = "/LoginControl" component={LoginControl}/>
            <Route exact path = "/Market" component={Market}/>
            <Route exact path = "/Profile" component={Profile}/>
        </Switch>
    </HashRouter>
);

export default BasicRoute;