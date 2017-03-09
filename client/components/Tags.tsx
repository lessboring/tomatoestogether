import * as React from 'react';
import * as DocumentTitle from 'react-document-title';
import {observer, inject} from 'mobx-react';
import {Link} from 'react-router';
import {Task} from '../models';


@observer
export default class Tags extends React.Component<{}, {}> {
    render() {
        return (
            <div className="row">
                <div className="col-md-3">
                    <h1>Tags</h1>
                    <ul>
                        <li>
                            #apartment
                            <ul>
                                <li>#streaming</li>
                                <li>#kitchen</li>
                                <li>#with-friends</li>
                            </ul>
                        </li>
                        <li>
                            #out
                            <ul>
                                <li>#coworking-space</li>
                                <li>#store</li>
                                <li>#dancing</li>
                            </ul>
                        </li>
                        <li>#at-parents</li>
                    </ul>
                </div>
                <div className="col-md-9">
                    {this.props.children}
                </div>
            </div>
        );
    }
}


