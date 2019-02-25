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

## mongo

brew services list
brew install mongodb
brew services start mongodb

```
npm i --save-dev mongodb@3.1.10
```
src/server/connect-db.js
```
import { MongoClient } from 'mongodb';
const url = `mongodb://localhost:27017/myorganiser`;
let db = null;

export async function connectDB(){
    if (db) return db;
    let client = await MongoClient.connect(url, {useNewUrlParser: true});
    db = client.db();
    console.info("Got DB,", db);
    return db;
}
```
src/server/initialize-db.js
```
import { defaultState } from './defaultState';
import {connectDB}  from './connect-db';

async function initializeDB(){
    let db = await connectDB();
    for (let collectionName in defaultState){
        let collection = db.collection(collectionName);
        await collection.insertMany(defaultState[collectionName]);
    }
}

initializeDB();
```
package.json
```
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack",
    "dev": "webpack-dev-server --open",
    "initialize":"babel-node src/server/initialize-db"
  },
```
Now run the following to populate a db in mongo
```
npm run initialize
```
Install Robo 3T (formerly robomongo).
Run/refresh
myorganiser db is created
double click on tasks to see records.
nice.

## server
```
npm i --save-dev express@4.16.3 cors@2.8.4 body-parser@1.18.3
```

src/server/server.js
```
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

let port = 7777;
let app = express();

app.listen(port, console.log("server listening on port", port));

app.get('/', (req,res)=>{
    res.send("Hello world");
});
```
package.json
```
    "server": "babel-node src/server/server"
```
run server:
```
npm run server
```
in browser:     http://localhost:7777/

You should see Hello world.

## server part 2 - addNewTask

src/server/server.js
```
// app.get('/', (req,res)=>{
//     res.send("Hello world");
// });

app.use(
    cors(),
    bodyParser.urlencoded({extended:true}),
    bodyParser.json()
);

export const addNewTask = async task=>{
    let db = await connectDB();
    let collection = db.collection(`tasks`);
    await collection.insertOne(task);
}

app.post('/task/new', async (req,res)=>{
    let task = req.body.task;
    await addNewTask(task);
    res.status(200).send();
})
```
src/server/server.spec.js
```
import { addNewTask } from './server';

addNewTask({
    name:"My Task",
    id:"12345"
});
```
package.json
```
    "server-test":"babel-node src/server/server.spec"
```
command line
```
npm run server-test
```
should have no errors and robo 3T should show task written.

## server part 3 - updateTask

src/server/server.js
```
export const updateTask = async task=>{
    console.debug('updateTask ', task);
    let { id, group, isComplete, name} = task;
    let db = await connectDB();
    let collection = db.collection(`tasks`);
    if (group) {
        await collection.updateOne({id}, {$set:{group}});
    }
    if (name) {
        console.debug('update name');
        await collection.updateOne({id}, {$set:{name}});
    }
    if (isComplete !== undefined) {
        await collection.updateOne({id}, {$set:{isComplete}});
    }
}

app.post('/task/update', async (req,res)=>{
    let task = req.body.task;
    await updateTask(task);
    res.status(200).send();
});
```

src/server/server.spec.js

```
import { addNewTask, updateTask } from './server';

(async function myTest(){
    await addNewTask({
        name:"My Task",
        id:"12345"
    });
    await updateTask({
        name:"My Task - UPDATED",
        id:"12345"
    });
})();
```
NB: note myTest is an iife Immediately Invoked Function Expression.
Now when you run the test, mongo will show the task updated.
Cool.

## join up server and ui
```
npm i --save-dev concurrently@4.0.1
```

package.json
```
    "start-dev": "concurrently \"npm run server\" \"npm run dev\"" 
```

now run both concurrently:
```
npm run start-dev
```

### axios for http
```
npm i --save axios@0.18.0
```
Next update sagas to use http calls rather than mock sagas.

src/app/store/index.js
```
//import * as sagas from './sagas.mock';
import * as sagas from './sagas';
```

src/app/store/sagas.js
```
import { take, put, select } from 'redux-saga/effects';
import * as mutations from './mutations'; // with dot slash means find .js file in same directory
import uuid from 'uuid'; // without dot looks for an npm module called uuid
import axios from 'axios';

const url = "http://localhost:7777";

/**
 * Reducers cannot have any randomness (they must be deterministic)
 * Since the action of creating a task involves generating a random ID, it is not pure.
 * When the response to an action is not deterministic in a Redux application, both Sagas and Thunks are appropriate.
 */
export function* taskCreationSaga(){
    while (true){
        
        const {groupID} = yield take(mutations.REQUEST_TASK_CREATION);
        console.log("saga running groupID:", groupID);
        const ownerID = `U1`;
        // const ownerID = yield select(state=>state.session.id);
        const taskID = uuid();
        yield put(mutations.createTask(taskID, groupID, ownerID));
        const { res } = yield axios.post(url + `/task/new/`,{
            task:{
                id:taskID,
                group: groupID,
                owner: ownerID,
                isComplete: false,
                name: "New task"
            }
        });
        console.info("Got response,", res);
    }
}
```

Now when you hit button 'Add New', in inspect you see 
'Got response, undefined'
in Robo 3T you can see a new task record created.

src/app/store/sagas.js
```
export function* taskModificationSaga() {
    while (true){
        const task = yield take([
            mutations.SET_TASK_GROUP,
            mutations.SET_TASK_NAME,
            mutations.SET_TASK_COMPLETE
        ]);
        axios.post(url + `/task/update`,{
            task:{
                id: task.taskID,
                group: task.groupID,
                name: task.name,
                isComplete: task.isComplete
            }
        });
    }
}
```

This is picked up automatically due to
src/app/store/index.js
```
import * as sagas from './sagas';
```

Now updates are also written to db. Nice.

src/app/components/Main.jsx
```
const RouteGuard = Component => ({match})=>{
    console.info("RouteGuard", match);
    return <Component match={match} />
}

export const Main = ()=>(
    <Router history={history}>
        <Provider store={store}>
            <div>
                <ConnectedNavigation />
                {/*Dashboard goes here!*/}
                {/* <ConnectDashboard/> */}
                {/* <Route exact path="/dashboard" render={()=> (<ConnectDashboard/>)} /> */}
                {/* <Route exact path="/task/:id" render={({match})=> (<ConnectedTaskDetail match={match} />)} /> */}
                <Route exact path="/dashboard" render={RouteGuard(ConnectDashboard)} />
                <Route exact path="/task/:id" render={RouteGuard(ConnectedTaskDetail)} />
```

Now we can see our RouteGuard is a middleware function pre-cursor to route processing.

```
npm i --save react-router
```

src/server/defaultState.js
```
export const defaultState = {
    session:{
        authenticated:false
    },
```
src/app/store/index.js
```
export const store = createStore(
    // function reducer(state = defaultState, action){
    //     return state;
    // },
    combineReducers({
        session(session = defaultState.session){
            return session;
        },
        tasks(tasks = defaultState.tasks, action){
            . . .
```

Main.jsx
```
import {Redirect} from 'react-router';

const RouteGuard = Component => ({match})=>{
    console.info("RouteGuard", match);
    if (!store.getState().session.authenticated){
        // reroute
        return <Redirect to="/" />;
    }
    return <Component match={match} />
}
```

So now pages are rerouted to '/'.

src/app/components/Login.jsx
```
import React from 'react';
import { connect } from 'react-redux'

const LoginComponent = ()=>{  // <-- this curly bracket indicates returning a function rather than an object 
    return <div>Login here!</div>
}
const mapStateToProps = state=>state;
export const ConnectedLogin = connect(mapStateToProps)(LoginComponent);
```

src/app/components/Main.jsx
```
import {ConnectedLogin} from './Login'
. . .
export const Main = ()=>(
    <Router history={history}>
        <Provider store={store}>
            <div>
                <ConnectedNavigation />
                <Route exact path="/" component={ConnectedLogin}/>
```

So now we have the start of a login component.

## login continued

```
npm i --save md5
```
src/server/initialize-db.js
```
async function initializeDB(){
    let db = await connectDB();
    let user = await db.collection(`users`).findOne({id:"U1"});
    if (!user){
        for (let collectionName in defaultState){
            let collection = db.collection(collectionName);
            await collection.insertMany(defaultState[collectionName]);
        }    
    }
}
```

src/server/server.js
```
import './initialize-db';
```

src/server/defaultState.js
```
import md5 from 'md5';
export const defaultState = {
    // session:{
    //     authenticated:false
    // },
    users:[{
        id:"U1",
        name:"Dev",
        passwordHash:md5("TUPLES"),
        friends:[`U2`]
    },{
        id:"U2",
        name:"C. Eeyo",
        passwordHash:md5("PROFITING"),
        friends:[]
    }],
```

src/app/store/index.js
```
    combineReducers({
        session(session = defaultState.session || {}){
            return session;
        },
```
src/app/components/Login.jsx
```
const LoginComponent = ()=>{  // <-- this curly bracket indicates returning a function rather than an object 
    return <div>
        <h2>
            Please login
        </h2>
        <form>
            <input type="text" placeholder="username" name="username"
                defaultValue="Dev"/>
            <input type="password" placeholder="password" name="password"
                defaultValue=""/>
            <button type="submit">Login</button>
        </form>
    </div>
}
```

So we have a login form with username, password and submit button.
If you drop mongo db in Robo 3T.
Then ```npm run start-dev```
the db will be re-created and the two users records
will have password hashes.

src/app/store/mutations.js
```
export const REQUEST_AUTHENTICATE_USER = `REQUEST_AUTHENTICATE_USER`;
export const requestAuthenticateUser = (username, password)=>({
    type:REQUEST_AUTHENTICATE_USER,
    username,
    password
});
```

Login.jsx
```
import React from 'react';
import { connect } from 'react-redux';
import * as mutations from '../store/mutations';

const LoginComponent = ({authenticateUser})=>{  // <-- this curly bracket indicates returning a function rather than an object 
    return <div>
        <h2>
            Please login
        </h2>
        <form onSubmit={authenticateUser}>
            <input type="text" placeholder="username" name="username"
                defaultValue="Dev"/>
            <input type="password" placeholder="password" name="password"
                defaultValue=""/>
            <button type="submit">Login</button>
        </form>
    </div>
}
const mapStateToProps = state=>state;
const mapDispatchToProps = (dispatch)=>({
    authenticateUser(e){
        e.preventDefault();
        let username = e.target[`username`].value;
        let password = e.target[`password`].value;
        dispatch(mutations.requestAuthenticateUser(username, password));
    }
});
export const ConnectedLogin = connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
```
Now Login form dispatches REQUEST_AUTHENTICATE_USER action.

src/app/store/sagas.js
```
export function* userAuthenticationSaga(){
    while (true) {
        const {username, password} = yield take(mutations.REQUEST_AUTHENTICATE_USER);
        try{
            const {data} = yield axios.post(url + `/authenticate`, {username, password});
            if (!data){
                throw new Error();
            }
        } catch (e) {
            console.log("can't authenticate");
            yield put(mutations.processAuthenticateUser(mutations.NOT_AUTHENTICATED));
        }
    }
}
```

src/app/store/mutations.js
```
export const PROCESSING_AUTHENTICATE_USER = `PROCESSING_AUTHENTICATE_USER`;
export const NOT_AUTHENTICATED = `NOT_AUTHENTICATED`;
export const AUTHENTICATED = `AUTHENTICATED`;
export const AUTHENTICATING = `AUTHENTICATING`;

export const processAuthenticateUser = (status= AUTHENTICATING, session=null )=>({
    type:PROCESSING_AUTHENTICATE_USER,
    session,authenticated: status
});
```

src/app/store/index.js
```
    combineReducers({
        session(userSession = defaultState.session || {}, action){
            let {type, authenticated, session} = action;
            switch(type){
                case mutations.REQUEST_AUTHENTICATE_USER:
                    return {...userSession, authenticated:mutations.AUTHENTICATING};
                case mutations.PROCESSING_AUTHENTICATE_USER:
                    return {...userSession, authenticated};
                default:
                    return userSession;
            }
        },
```

src/app/components/Login.jsx
```
const LoginComponent = ({authenticateUser, authenticated})=>{  // <-- this curly bracket indicates returning a function rather than an object 
    return <div>
        <h2>
            Please login
        </h2>
        <form onSubmit={authenticateUser}>
            <input type="text" placeholder="username" name="username"
                defaultValue="Dev"/>
            <input type="password" placeholder="password" name="password"
                defaultValue=""/>
            {authenticated === mutations.NOT_AUTHENTICATED ? <p> Login incorrect</p> : null }
            <button type="submit">Login</button>
        </form>
    </div>
}
//const mapStateToProps = state=>state;
const mapStateToProps = ({session})=>({
    authenticated: session.authenticated
});
```

Now front end has authentication functionality but server needs to authenticate.

src/server/server.js
```
import {authenticationRoute} from './authenticate';
. . .
app.use(
    cors(),
    bodyParser.urlencoded({extended:true}),
    bodyParser.json()
);

authenticationRoute(app);
```

src/server/authenticate.js
```
import {connectDB} from './connect-db';
import uuid from 'uuid';
import md5 from 'md5';

const authenticationTokens = [];

async function assembleUserState(user){
    let db = await connectDB();

    let tasks = await db.collection(`tasks`).find({owner:user.id}).toArray();
    let groups = await db.collection(`groups`).find({owner:user.id}).toArray();
    return {
        tasks,
        groups,
        session:{authenticated:`AUTHENTICATED`,id:user.id}
    }
}
export const authenticationRoute = app => {
    app.post('/authenticate', async (req, res) => {
        //console.info("server /authenticate route", req.body);
        let {username, password} = req.body;
        let db = await connectDB();
        let collection = db.collection(`users`);
        let user = await collection.findOne({name:username});
        if (!user){

            return res.status(500).send("User not found");
        }
        let hash = md5(password);
        let passwordCorrect = hash === user.passwordHash;

        if (!passwordCorrect){
            return res.status(500).send("Password incorrect");
        }
        let token = uuid();
        authenticationTokens.push({
            token,
            userID: user.id
        });
        let state=await assembleUserState(user);
        res.send({token,state});
    })
}
```

restart server and ui for server change to take effect.

Now user: Dev pw:TUPLES results in server 
passing back correct token:

authenticated {token: "50945233-21c7-4fa3-9c9d-732a72cf8c12", state: {…}}state: {tasks: Array(4), groups: Array(3), session: {…}}token: "50945233-21c7-4fa3-9c9d-732a72cf8c12"

src/app/store/mutations.js
```
export const SET_STATE = `SET_STATE`;
export const setState = (state = {} )=>({
    type:SET_STATE,
    state
});
```

src/app/store/index.js
```
    combineReducers({
        session(userSession = defaultState.session || {}, action){
            let {type, authenticated, session} = action;
            switch(type){
                case mutations.SET_STATE:
                    return {...userSession, id:action.state.session.id};
 . . .
        tasks(tasks = [], action){
            switch(action.type){
                case mutations.SET_STATE:
                    return action.state.tasks;
. . .
        comments(comments = []){
            return comments;
        },
        groups(groups = [], action){
            switch(action.type){
                case mutations.SET_STATE:
                    return action.state.groups;
            }
            return groups;
        },
        users(users = []){
            return users;
```
Now when a correct username + password are entered
then state is correctly set. So now we just have to redirect to nother page.

```
{session: {…}, tasks: Array(4), comments: Array(0), groups: Array(3), users: Array(0)}
comments: []
groups: (3) [{…}, {…}, {…}]
session: {authenticated: "AUTHENTICATING", id: "U1"}
tasks: Array(4)
0: {_id: "5c72ba33189dce6fed2104b4", name: "Refactor tests", id: "T1", group: "G1", owner: "U1", …}
1: {_id: "5c72ba33189dce6fed2104b5", name: "Meet with CTO", id: "T2", group: "G1", owner: "U1", …}
2: {_id: "5c72ba33189dce6fed2104b7", name: "Update component snapshots", id: "T4", group: "G2", owner: "U1", …}
3: {_id: "5c72ba33189dce6fed2104b8", name: "Production optimizations", id: "T5", group: "G3", owner: "U1", …}
length: 4
__proto__: Array(0)
users: Array(0)
length: 0
```

src/app/store/sagas.js
```
import {history} from './history';
. . . 
export function* userAuthenticationSaga(){
    while (true) {
        const {username, password} = yield take(mutations.REQUEST_AUTHENTICATE_USER);
        console.log("userAuthenticationSaga {username, password}=", {username, password});
        try{
            const {data} = yield axios.post(url + `/authenticate`, {username, password});
            if (!data){
                throw new Error();
            }
            console.log("authenticated", data);
            yield put(mutations.setState(data.state));
            yield put(mutations.processAuthenticateUser(mutations.AUTHENTICATED));

            history.push('/dashboard');
            
        } catch (e) {
            console.log("can't authenticate");
            yield put(mutations.processAuthenticateUser(mutations.NOT_AUTHENTICATED));
        }
    }
}
```

Now the app is authenticated, routes to thedashboard on correct user/password and the tasks persist.
