import React from 'react';
import { Provider } from 'react-redux';
import {store} from '../store'
import {ConnectDashboard} from './Dashboard'


export const Main = ()=>(
    <Provider store={store}>
        <div>
            {/*Dashboard goes here!*/}
            <ConnectDashboard/>
        </div>
    </Provider>
)
