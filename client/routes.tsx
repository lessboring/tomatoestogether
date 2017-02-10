import * as React from 'react';
import { Route, IndexRoute } from 'react-router';

import Home from './pages/Home';
import Layout from './pages/Layout';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Empty from './pages/Empty';

export default (
    <Route path="/" component={Layout}>
        <IndexRoute component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
        <Route path="*" component={Empty} />
    </Route>
);
