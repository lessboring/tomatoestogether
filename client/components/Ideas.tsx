import * as React from 'react';
import * as DocumentTitle from 'react-document-title';
import {observer, inject} from 'mobx-react';
import {Link} from 'react-router';


@observer
export default class Ideas extends React.Component<{}, {}> {
    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <h1>Ideas</h1>
                    <p>A thing for capturing ideas as you have them</p>
                    <p>A thing where other people can dump ideas and assignments into your system</p>
                </div>
            </div>
        );
    }
}
