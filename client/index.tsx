import * as React from 'react';
import { render } from 'react-dom';
import routes from './routes';
import {Provider} from 'mobx-react';
import { Router, browserHistory, applyRouterMiddleware } from 'react-router';
import { useHistoryRestoreScroll, useRouterRestoreScroll } from 'react-router-restore-scroll';
import {Store, SignUpStore, LoginStore, Project, Task} from './stores';
import * as moment from 'moment';

const store = new Store();
const signUpStore = new SignUpStore(store);
const loginStore = new LoginStore(store);

store.addProject({id:1, name:'Business Development'});
store.addProject({id:2, name:'Tomatoes Together', parent:1});

store.addProject({id:7, name:'Inbox Feature', parent:2});
store.addProject({id:8, name:'Project Management', parent:2});
store.addProject({id:9, name:'Stats', parent:2});


store.addProject({id:3, name:'Online Courses'});
store.addProject({id:4, name:'Django', parent:3});
store.addProject({id:5, name:'Vim', parent:3});
store.addProject({id:6, name:'React + Mobx', parent:3});

store.addTask({
    id:1,
    project: 2,
    title:'Make the UI', 
    index: 0,
    completed: false,
});

store.addTask({
    id:2,
    project: 2,
    title:'Make the model layer', 
    index: 0,
    completed: false,
});

store.addTask({
    id:3,
    project: 2,
    parent: 1,
    title:'Create the task model', 
    index: 0,
    completed: false,
});

store.addTask({
    id:4,
    project: 2,
    parent: 1,
    title:'Create the project model', 
    index: 0,
    completed: false,
});

store.addTask({
    id:5,
    project: 2,
    parent: 1,
    title:'Create the user model', 
    index: 0,
    completed: false,
});

store.addTomato({
    id: 1,
    project: 2,
    startTime: moment({hour: 3, minute: 0}),
});
store.addTomato({
    id: 2,
    project: 2,
    startTime: moment({hour: 3, minute: 30}),
});
store.addTomato({
    id: 3,
    project: 2,
    startTime: moment({hour: 3, minute: 30}),
});
store.addTomato({
    id: 4,
    project: 7,
    startTime: moment({hour: 3, minute: 30}),
});
store.addTomato({
    id: 5,
    project: 8,
    startTime: moment({hour: 3, minute: 30}),
});
store.addTomato({
    id: 6,
    project: 8,
    startTime: moment({hour: 3, minute: 30}),
});

const createHistory = useHistoryRestoreScroll(() => browserHistory);
const routerRender = applyRouterMiddleware(useRouterRestoreScroll());

export default () => {
    render(
        <Provider
            store={store}
            signUpStore={signUpStore}
            loginStore={loginStore}
        ><Router
                routes={routes}
                history={createHistory()}
                render={routerRender}
            />
        </Provider>,
        document.getElementById('app')
    );
};
