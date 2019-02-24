import React from 'react';
import { connect } from 'react-redux'

const LoginComponent = ()=>{  // <-- this curly bracket indicates returning a function rather than an object 
    return <div>Login here!</div>
}
const mapStateToProps = state=>state;
export const ConnectedLogin = connect(mapStateToProps)(LoginComponent);