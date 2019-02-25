import React from 'react';
import { connect } from 'react-redux'
import * as mutations from '../store/mutations';
import {Link} from 'react-router-dom'
import { ConnectedUsernameDisplay } from './UsernameDisplay';

const Navigation = ({id, authenticated}) =>(
    <div>
        <Link to="/dashboard">
            <h1>
                Task Application
            </h1>
        </Link>
        { authenticated ?
        <h4>
            Welcome, <ConnectedUsernameDisplay id={id} />
        </h4>
        : null
        }
    </div>
);

const mapStateToProps = ({session})=>({
    id:session.id,
    authenticated:session.authenticated == mutations.AUTHENTICATED
});

export const ConnectedNavigation = connect(mapStateToProps)(Navigation);