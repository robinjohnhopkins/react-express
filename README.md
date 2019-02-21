## react express
Follow on from plural sight course
https://app.pluralsight.com/player?course=react-express-full-stack-app-building&author=daniel-stern
https://github.com/danielstern/express-react-fullstack


## create package
```
npm init --yes
npm i --save-dev webpack@4.17.2
npm i --save-dev webpack-cli@3.1.2
npm i --save-dev webpack-dev-server@3.1.7
npm i --save-dev @babel/core@7.0.0
NB if package begins @ it indicates the first name is the publisher
npm i --save-dev @babel/node@7.0.0
npm i --save-dev @babel/preset-env@7.0.0
npm i --save-dev @babel/preset-react@7.0.0
npm i --save-dev @babel/register@7.0.0
npm i --save-dev babel-loader@8.0.2
create .babelrc webpack.config.js index.html src/app/index.js .gitignore
```
run to see Hello World in browser
```
npm run dev
```
## add redux
create src/server/defaultState.js
```
npm i --save redux@4.0.0
```
create src/app/store/index.js
alter src/app/index.js to access store and console.log to see object in 'inspect'.

## dashboard component
```
npm i --save react@16.4.2 react-dom@16.5.0 react-redux@5.0.7
```

create src/app/components/Dashboard.jsx
```
import React from 'react';

export const Dashboard = ({groups})=>(  // <-- this round bracket indicates returning an object rather than a function
    <div>
        <h2>Dashboard</h2>
    </div>
)
```
then alter src/app/index.js
```
import {store} from './store/index'
import React from 'react';
import ReactDOM from 'react-dom';
import { Dashboard } from './components/Dashboard';
// console.log("Hello world");
// console.log(store.getState());

ReactDOM.render(
    < Dashboard/>,
    document.getElementById("app")
)
```

At this point the dashboard is added to web page.

create src/app/components/Main.jsx
```
import React from 'react';
import { Provider } from 'react-redux';
import {store} from '../store'

export const Main = ()=>(
    <Provider store={store}>
        <div>
            Dashboard goes here!
        </div>
    </Provider>
)
```

then alter src/app/index.js

```
import {store} from './store/index'
import React from 'react';
import ReactDOM from 'react-dom';
import { Main } from './components/Main';

ReactDOM.render(
    < Main/>,
    document.getElementById("app")
)
```

web page still working :)

alter src/app/components/Main.jsx
```
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
```

alter src/app/components/Dashboard.jsx

```
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
```

At this point the dash board has an entry for each group.

add src/app/components/TaskList.jsx
```
import React from 'react';
import { connect } from 'react-redux'

export const TaskList =({tasks, name})=>(
    <div>
        <h3>
            {name}
        </h3>
        <div>
            {tasks.map(task=>(<div>{task.name}</div>))}
        </div>
    </div>
)
const mapStateToProps= (state, ownProps) => {
    let groupID = ownProps.id;
    return {
        name:ownProps.name,
        id:groupID,
        tasks: state.tasks.filter(task=>task.group === groupID)
    }
};

export const ConnectTaskList = connect(mapStateToProps)(TaskList);
```
wire up by altering Dashboard
```
import React from 'react';
import { connect } from 'react-redux'
import { ConnectTaskList } from './TaskList'

export const Dashboard = ({groups})=>(  // <-- this round bracket indicates returning an object rather than a function
    <div>
        <h2>Dashboard</h2>
        {groups.map(group=>(
            <ConnectTaskList id={group.id} name={group.name}></ConnectTaskList>
        ))}
    </div>
)

function mapStateToProps(state) {
    return {
        groups:state.groups
    }
}

export const ConnectDashboard = connect(mapStateToProps)(Dashboard);
```

dashboard now shows tasklist.

## routing and navigation
```
npm i --save react-router-dom@4.3.1
```
add
src/app/store/history.js
```
import {createBrowserHistory} from 'history'

export const history = createBrowserHistory();
```

alter Main
```
import React from 'react';
import { Provider } from 'react-redux';
import {store} from '../store'
import {ConnectDashboard} from './Dashboard'
import {Router, Route} from 'react-router-dom'
import {history } from '../store/history'

export const Main = ()=>(
    <Router history={history}>
        <Provider store={store}>
            <div>
                {/*Dashboard goes here!*/}
                {/* <ConnectDashboard/> */}
                <Route exact path="/dashboard" render={()=> (<ConnectDashboard/>)} />
            </div>
        </Provider>
    </Router>
)
```

now dashboard is at http://localhost:8080/dashboard

add src/app/components/Navigation.jsx
```
import React from 'react';
import { connect } from 'react-redux'
import { ConnectTaskList } from './TaskList'
import {Link} from 'react-router-dom'

const Navigation = () =>(
    <div>
        <Link to="/dashboard">
            <h1>
                My Application
            </h1>
        </Link>
    </div>
);

export const ConnectedNavigation = connect(state => state)(Navigation);
```

Main
```
import { ConnectedNavigation } from './Navigation'

export const Main = ()=>(
    <Router history={history}>
        <Provider store={store}>
            <div>
                <ConnectedNavigation />
                {/*Dashboard goes here!*/}
                {/* <ConnectDashboard/> */}
                <Route exact path="/dashboard" render={()=> (<ConnectDashboard/>)} />
```

We now have links and navigation.

## add button to tasks

TaskList
```
export const TaskList =({tasks, name, id, createNewTask})=>(
    <div>
        <h3>
            {name}
        </h3>
        <div>
            {tasks.map(task=>(<div key={task.id} >{task.name}</div>))}
        </div>
        <button onClick={()=>createNewTask(id)} >Add New</button>
    </div>
)

const mapStateToProps= (state, ownProps) => {
    let groupID = ownProps.id;
    return {
        name:ownProps.name,
        id:groupID,
        tasks: state.tasks.filter(task=>task.group === groupID)
    }
};

const mapDispatchToProps = (dispatch, ownProps)=>{
    return {
        createNewTask(id) {
            console.log("creating new task ...", id);
        }
    }
}
export const ConnectTaskList = connect(mapStateToProps, mapDispatchToProps)(TaskList);
```
## add logging
```
npm i --save redux-logger@3.0.6 redux-saga@0.16.2
```

src/app/store/index.js
```
import {createStore, applyMiddleware} from 'redux';
import {defaultState} from '../../server/defaultState';
import { createLogger } from 'redux-logger';


export const store = createStore(
    function reducer(state = defaultState, action){
        return state;
    },
    applyMiddleware(createLogger())
);
```

now extra logging appears in the inspect console on click!
```
npm i --save uuid
```

## saga
src/app/store/sagas.mock.js

```
import { take, put, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import * as mutations from './mutations';
import uuid from 'uuid';
//import {  } from 'react-router'
//import { history } from './history';

/**
 * Reducers cannot have any randomness (they must be deterministic)
 * Since the action of creating a task involves generating a random ID, it is not pure.
 * When the response to an action is not deterministic in a Redux application, both Sagas and Thunks are appropriate.
 */
export function* taskCreationSaga(){
    while (true){
        
        const {groupID} = yield take(mutations.REQUEST_TASK_CREATION);
        console.log("saga running groupID:", groupID);

        // const ownerID = yield select(state=>state.session.id);
        // const taskID = uuid();
        // yield put(mutations.createTask(taskID, groupID, ownerID));
    }
}

// export function* userAuthenticationSaga(){
//     while (true){
//         const {username,password} = yield take(mutations.REQUEST_AUTHENTICATE_USER);
//         yield delay(250);
//         yield put(mutations.processAuthenticateUser(mutations.AUTHENTICATED, {
//             id:"U1",
//             token:"ABCD-1234",
//         }));

//         history.push(`/dashboard`)
//     }
// }
```

src/app/store/index.js
```
import {createStore, applyMiddleware} from 'redux';
import {defaultState} from '../../server/defaultState';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();
import * as sagas from './sagas.mock';

export const store = createStore(
    function reducer(state = defaultState, action){
        return state;
    },
    applyMiddleware(createLogger(), sagaMiddleware)
);

for (let saga in sagas){
    sagaMiddleware.run(sagas[saga]);
}
```

now saga is triggered on each botton press.

sagas.mock.js
```
export function* taskCreationSaga(){
    while (true){
        
        const {groupID} = yield take(mutations.REQUEST_TASK_CREATION);
        console.log("saga running groupID:", groupID);
        const ownerID = `U1`;
        // const ownerID = yield select(state=>state.session.id);
        const taskID = uuid();
        yield put(mutations.createTask(taskID, groupID, ownerID));
    }
}
```

store/index.js
```
import {createStore, applyMiddleware, combineReducers} from 'redux';
import {defaultState} from '../../server/defaultState';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();
import * as sagas from './sagas.mock';
import * as mutations from './mutations';


export const store = createStore(
    // function reducer(state = defaultState, action){
    //     return state;
    // },
    combineReducers({
        tasks(tasks = defaultState.tasks, action){
            switch(action.type){
                case mutations.CREATE_TASK:
                    console.log(action);
            }
            return tasks;
        },
        comments(comments = defaultState.comments){
            return comments;
        },
        groups(groups = defaultState.groups){
            return groups;
        },
        users(users = defaultState.users){
            return users;
        }
    }),
    applyMiddleware(createLogger(), sagaMiddleware)
);

for (let saga in sagas){
    sagaMiddleware.run(sagas[saga]);
}
```
now in saga CREATE_TASK has been dispatched.

sagas.mock.js
```
export function* taskCreationSaga(){
    while (true){
        
        const {groupID} = yield take(mutations.REQUEST_TASK_CREATION);
        console.log("saga running groupID:", groupID);
        const ownerID = `U1`;
        // const ownerID = yield select(state=>state.session.id);
        const taskID = uuid();
        yield put(mutations.createTask(taskID, groupID, ownerID));
    }
}
```
store/index.js
```
    combineReducers({
        tasks(tasks = defaultState.tasks, action){
            switch(action.type){
                case mutations.CREATE_TASK:
                    console.log(action);
                    return [...tasks, {
                        id:action.taskID,
                        name:"New Task",
                        group:action.groupID,
                        owner:action.ownerID,
                        isComplete:false
                    }]
            }
            return tasks;
        },
```
now REQUEST_TASK_CREATION and CREATE_TASK are seen in console log.
```
 action REQUEST_TASK_CREATION @ 16:05:36.252
redux-logger.js:388  prev state {tasks: Array(6), comments: Array(1), groups: Array(3), users: Array(2)}
redux-logger.js:392  action     {type: "REQUEST_TASK_CREATION", groupID: "G2"}
redux-logger.js:401  next state {tasks: Array(6), comments: Array(1), groups: Array(3), users: Array(2)}
redux-logger.js:377  action CREATE_TASK @ 16:05:36.253
redux-logger.js:388  prev state {tasks: Array(6), comments: Array(1), groups: Array(3), users: Array(2)}
redux-logger.js:392  action     {type: "CREATE_TASK", taskID: "55f3e651-f88d-40e4-81cd-c4458498b044", groupID: "G2", ownerID: "U1", @@redux-saga/SAGA_ACTION: true}
redux-logger.js:401  next state {tasks: Array(7), comments: Array(1), groups: Array(3), users: Array(2)}
```

Each new task created has a unique task.id.
But on page refresh - values do not persist.

## Task details route

src/app/components/Main.jsx
```
import { ConnectedTaskDetail } from './TaskDetail'

export const Main = ()=>(
    <Router history={history}>
        <Provider store={store}>
            <div>
                <ConnectedNavigation />
                {/*Dashboard goes here!*/}
                {/* <ConnectDashboard/> */}
                <Route exact path="/dashboard" render={()=> (<ConnectDashboard/>)} />
                <Route exact path="/task/:id" render={({match})=> (<ConnectedTaskDetail match={match} />)} />
            </div>
        </Provider>
    </Router>
)
```

src/app/components/TaskDetail.jsx
```
/**
 * The task detail component route is a more sophisticated form that has many different fields.
 * The component automatically calls the REST API [via a mutation] to update the server on every change.
 */
import React from 'react';
import uuid from 'uuid';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as mutations from '../store/mutations'

//import { ConnectedUsernameDisplay } from './UsernameDisplay'

import {
    setTaskCompletion,
    addTaskComment,
    setTaskGroup,
    setTaskName
} from '../store/mutations'

const TaskDetail = ({
    id,
    comments,
    task,
    isOwner,
    isComplete,
    sessionID,
    groups,

    setTaskCompletion,
    addTaskComment,
    setTaskGroup,
    setTaskName
})=>{
    return (
        <div className="card p-3 col-6">
        Task Detail
            {isOwner ?
                <div>
                    <input type="text" value={task.name} onChange={setTaskName} className="form-control form-control-lg"/>
                </div>
                    :
                <h3>
                    {task.name} {isComplete ? `✓` : null}
                </h3>
            }

            <div className="mt-3">
                {isOwner ?
                    <div>
                        <div>
                            You are the owner of this task.
                            <button  className="btn btn-primary ml-2" onClick={() => setTaskCompletion(id,!isComplete)}>
                                {isComplete ? `Reopen` : `Complete`} This Task
                            </button>
                        </div>
                    </div>
                    :
                    <div>
                        <ConnectedUsernameDisplay id={task.owner}/> is the owner of this task.
                    </div>}
            </div>
            {/* <div className="mt-2">
                {comments.map(comment=>(
                    <div key={comment.id}>
                        <ConnectedUsernameDisplay id={comment.owner}/> : {comment.content}
                    </div>
                ))}
            </div> */}

            <form className="form-inline">
                <span className="mr-4">
                    Change Group
                </span>
                <select onChange={setTaskGroup} value={task.group} className="form-control">
                    {groups.map(group=>(
                        <option key={group.id} value={group.id}>
                            {group.name}
                        </option>
                    ))}
                </select>
            </form>

            {/* <form className="form-inline" onSubmit={(e)=>addTaskComment(id,sessionID,e)}>
                <input type="text" name="commentContents" autoComplete="off" placeholder="Add a comment" className="form-control"/>
                <button type="submit" className="btn">Submit</button>
            </form> */}

            <div>
            <Link to="/dashboard">
                <button className="btn btn-primary mt-2">
                    Done
                </button>
            </Link>
            </div>
        </div>
    )
}

function mapStateToProps(state,ownProps){
    let id = ownProps.match.params.id;
    let task = state.tasks.find(task=>task.id === id);
    let comments = state.comments.filter(comment=>comment.task === id);
    let isOwner = true; //state.session.id === task.owner;
    let groups = state.groups;

    return {
        id,
        task,
        comments,
        isOwner,
        sessionID: null, //state.session.id,
        isComplete: task.isComplete,
        groups
    }
}

function mapDispatchToProps(dispatch, ownProps){
    let id = ownProps.match.params.id;
    return {
        setTaskCompletion(id,isComplete){
            dispatch(setTaskCompletion(id,isComplete));
        },
        setTaskGroup(e){
            dispatch(setTaskGroup(id,e.target.value));
        },
        setTaskName(e){
            dispatch(setTaskName(id,e.target.value));
        },
        addTaskComment(taskID, ownerID, e) {
            let input = e.target[`commentContents`];
            let commentID = uuid();
            let content = input.value;
            e.preventDefault();
            if (content !== ``) {
                input.value = ``;
                dispatch(addTaskComment(commentID, taskID, ownerID, content));
            }
        }
    }
}

export const ConnectedTaskDetail = connect(mapStateToProps,mapDispatchToProps)(TaskDetail);
```
src/app/components/TaskList.jsx
```
import { Link } from 'react-router-dom'

export const TaskList =({tasks, name, id, createNewTask})=>(
    <div>
        <h3>
            {name}
        </h3>
        <div>
            {tasks.map(task=>(
                <Link to={`/task/${task.id}`} key={task.id} >
                    <div key={task.id} >{task.name}</div>
                </Link>
```

src/app/store/index.js
```
                case mutations.SET_TASK_COMPLETE:
                    return tasks.map(task=>{
                        return (task.id === action.taskID) ?
                            {...task, isComplete:action.isComplete} :
                            task;
                    });
                case mutations.SET_TASK_NAME:
                    return tasks.map(task=>{
                        return (task.id === action.taskID) ?
                            {...task, name:action.name} :
                            task;
                    });
                case mutations.SET_TASK_GROUP:
                    return tasks.map(task=>{
                        return (task.id === action.taskID) ?
                            {...task, group:action.groupID} :
                            task;
                    });
```
src/app/store/mutations.js
```
export const SET_TASK_COMPLETE = `SET_TASK_COMPLETE`;
export const SET_TASK_GROUP = `SET_TASK_GROUP`;
export const SET_TASK_NAME = `SET_TASK_NAME`;
export const ADD_TASK_COMMENT = `ADD_TASK_COMMENT`;
export const REQUEST_TASK_CREATION = `REQUEST_TASK_CREATION`;
export const CREATE_TASK = `CREATE_TASK`;

export const setTaskCompletion = (id, isComplete = true)=>({
    type:SET_TASK_COMPLETE,
    taskID:id,
    isComplete
});

export const addTaskComment = (commentID, taskID, ownerID, content)=>({
    type:ADD_TASK_COMMENT,
    id:commentID,
    task: taskID,
    owner: ownerID,
    content
});

export const requestTaskCreation = (groupID)=>({
    type:REQUEST_TASK_CREATION,
    groupID
});
export const createTask = (taskID, groupID, ownerID)=>({
    type:CREATE_TASK,
    taskID,
    groupID,
    ownerID
});
export const setTaskGroup = (taskID, groupID)=>({
    type:SET_TASK_GROUP,
    taskID,
    groupID
});

export const setTaskName = (taskID, name)=>({
    type:SET_TASK_NAME,
    taskID,
    name
});
```

ui for task details now updates a bit
the focus will change to server
to add mongo and persistence with a REST api
later to come back to gui.



