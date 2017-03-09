import * as React from 'react';
import * as DocumentTitle from 'react-document-title';
import {observer, inject} from 'mobx-react';
import {Link} from 'react-router';
import {Task} from '../models';
import Tasks from './Tasks';


@observer
export default class Inbox extends React.Component<{}, {}> {
    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <h1>Inbox</h1>
                </div>
            </div>
        );
    }
}




