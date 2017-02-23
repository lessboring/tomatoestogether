import * as React from 'react';
import * as DocumentTitle from 'react-document-title';
import {observer, inject} from 'mobx-react';
import {Link} from 'react-router';
import {store} from '../store';


@observer
export default class TomatoTimer extends React.Component<{}, {}> {
    render() {
        return (
            <div className={'timer ' + store.state}>
                <div className="time-display">
                    {store.formattedTime}
                </div>
                <div className="task-display">
                    {store.state === 'tomato'
                        ? 'Tomato Time!'
                        : 'Break Time!'
                    }
                </div>
            </div>
        );
    }
}
