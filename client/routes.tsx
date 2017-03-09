import * as React from 'react';
import { Route, IndexRoute } from 'react-router';

//import Home from './components/Home';
import Layout from './components/Layout';
//import Login from './components/Login';
//import Logout from './components/Logout';
//import Inbox from './components/Inbox';
import Tasks from './components/Tasks';
import Projects from './components/Projects';
//import Tags from './components/Tags';
//import Calendar from './components/Calendar';
import Stats from './components/Stats';
import Empty from './components/Empty';

export default (
    <Route path="/" component={Layout}>

        <Route path="projects" component={Projects}>
            <Route path=":projectId" component={Tasks} />
        </Route>
        <Route path="stats" component={Stats} />

        <Route path="*" component={Empty} />
    </Route>
);

//<IndexRoute component={Home} />
//<Route path="login" component={Login} />
//<Route path="logout" component={Logout} />

//<Route path="inbox" component={Inbox} />
//<Route path="tags" component={Tags} />
//<Route path="calendar" component={Calendar} />
