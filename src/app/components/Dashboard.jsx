import React from 'react';
import { connect } from 'react-redux'
import { ConnectTaskList } from './TaskList'

export const Dashboard = ({groups})=>(  // <-- this round bracket indicates returning an object rather than a function
    <div>
        <h2>Dashboard</h2>
        {groups.map(group=>(
            <ConnectTaskList key={group.id} id={group.id} name={group.name}></ConnectTaskList>
        ))}
    </div>
)

function mapStateToProps(state) {
    return {
        groups:state.groups
    }
}

export const ConnectDashboard = connect(mapStateToProps)(Dashboard);