import React from 'react';
import { connect } from 'react-redux'

export const Dashboard = ({groups})=>(  // <-- this round bracket indicates returning an object rather than a function
    <div>
        <h2>Dashboard</h2>
        {groups.map(group=>(
            <div>
                    {group.name}
            </div>
        ))}
    </div>
)

function mapStateToProps(state) {
    return {
        groups:state.groups
    }
}

export const ConnectDashboard = connect(mapStateToProps)(Dashboard);