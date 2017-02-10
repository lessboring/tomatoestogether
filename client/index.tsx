import * as React from 'react';
import { render } from 'react-dom';
import routes from './routes';
import { Router, browserHistory, applyRouterMiddleware } from 'react-router';
import { useHistoryRestoreScroll, useRouterRestoreScroll } from 'react-router-restore-scroll';

const createHistory = useHistoryRestoreScroll(() => browserHistory);
const routerRender = applyRouterMiddleware(useRouterRestoreScroll());

render(
    <Router routes={routes} history={createHistory()} render={routerRender}/>,
    document.getElementById('app')
);

