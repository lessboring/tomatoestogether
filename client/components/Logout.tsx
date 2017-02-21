import * as React from 'react';

export default class Logout extends React.Component<any, any> {
    componentWillMount() {
        localStorage.removeItem('token');
        window.location.href = '';
    }
    render() {
        return <div/>;
    }
}
