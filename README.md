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

export const TaskList =({tasks})=>(
    <div>
        {tasks.map(task=>(<div>{task.name}</div>))}
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


