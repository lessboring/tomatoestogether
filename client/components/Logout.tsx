import * as React from 'react';
import { browserHistory } from 'react-router';

export default class Logout extends React.Component<any, any> {
    componentWillMount() {
        localStorage.removeItem('token');
        browserHistory.push('/');
    }
    render() {
        return <div/>;
    }
}
