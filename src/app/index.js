import {store} from './store/index'
import React from 'react';
import ReactDOM from 'react-dom';
import { Main } from './components/Main';
// console.log("Hello world");
// console.log(store.getState());

ReactDOM.render(
    < Main/>,
    document.getElementById("app")
)