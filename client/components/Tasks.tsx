import * as React from 'react';
import * as DocumentTitle from 'react-document-title';
import {observer, inject} from 'mobx-react';
import {Link} from 'react-router';
import {store} from '../store';
import {Task} from '../models';
import ContentEditable from './ContentEditable';


@observer
class TaskNode extends React.Component<{task: Task}, {}> {
    render(): JSX.Element | null {
        const {task} = this.props;
        return (
            <ContentEditable
                html={task.title}
                onChange={(html) => task.title = html}
            >
                {store.tasks.map((task: Task) => (
                    <TaskNode task={task} />
                ))}
            </ContentEditable>
        );
    }
}

@observer
export default class Tasks extends React.Component<{}, {}> {
    render() {
        return (
            <div>
                {store.tasks.map((task: Task) => (
                    <TaskNode task={task} />
                ))}
            </div>
        );
    }
}
