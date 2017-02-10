import * as React from 'react';
import * as DocumentTitle from 'react-document-title';
import {Link} from 'react-router';


export default class Home extends React.Component<{}, {}> {
    render() {
        return (
            <DocumentTitle title="Log In | Tomatoes Together">
                <h1>Log In</h1>
            </DocumentTitle>
        );
    }
}
