import * as React from 'react';
import * as DocumentTitle from 'react-document-title';
import {observer, inject} from 'mobx-react';
import {observable, ObservableMap, asMap, computed, action} from 'mobx';
import {Link} from 'react-router';
import http from '../http';
import {Store} from '../stores';
import * as models from '../models';
import vm from '../view-model';
import {times} from '../util';


@inject('store')
@observer
export default class Stats extends React.Component<{store: Store}, {}> {
    render() {
        const store = this.props.store!;
        return (
            <div className="row">
                <div className="col-md-12">
                    <h1>Tomatoes Per Project</h1>
                </div>
            </div>
        );
    }
}
