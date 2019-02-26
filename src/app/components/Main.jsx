import React from 'react';
import { Provider } from 'react-redux';
import {store} from '../store'
import {ConnectDashboard} from './Dashboard'
import {ConnectedLogin} from './Login'
import {Router, Route} from 'react-router-dom'
import {history } from '../store/history'
import { ConnectedNavigation } from './Navigation'
import { ConnectedTaskDetail } from './TaskDetail'
import {Redirect} from 'react-router';
import StatList from './StatList';

const RouteGuard = Component => ({match})=>{
    console.info("RouteGuard", match);
    if (!store.getState().session.authenticated){
        // reroute
        return <Redirect to="/" />;
    }
    return <Component match={match} />
}

export const Main = ()=>(
    <Router history={history}>
        <Provider store={store}>
            <div>
                <ConnectedNavigation />
                <Route exact path="/" component={ConnectedLogin}/>
                <Route exact path="/stats" render={RouteGuard(StatList)}/>
                {/*Dashboard goes here!*/}
                {/* <ConnectDashboard/> */}
                {/* <Route exact path="/dashboard" render={()=> (<ConnectDashboard/>)} /> */}
                {/* <Route exact path="/task/:id" render={({match})=> (<ConnectedTaskDetail match={match} />)} /> */}
                <Route exact path="/dashboard" render={RouteGuard(ConnectDashboard)} />
                <Route exact path="/task/:id" render={RouteGuard(ConnectedTaskDetail)} />
            </div>
        </Provider>
    </Router>
)
