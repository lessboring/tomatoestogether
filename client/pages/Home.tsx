import * as React from 'react';
import * as DocumentTitle from 'react-document-title';
import {CardLayout} from '../components/Layouts';
import store from '../store';
import {observer} from 'mobx-react';
import {Link} from 'react-router';


interface Task {
    title: string;
}


@observer
class TimeDisplay extends React.Component<{}, {}> {
    render() {
        return (
            <div className="time-display">
                {store.formattedTime}
            </div>
        );
    }
}

@observer
class TaskDisplay extends React.Component<{task: Task}, {}> {
    render() {
        return (
            <div className="task-display">
                {this.props.task.title}
            </div>
        );
    }
}

@observer
class Timer extends React.Component<{task: Task}, {}> {
    render() {
        return (
            <div className={'timer ' + store.state}>
                <TimeDisplay />
                <TaskDisplay task={this.props.task} />
            </div>
        );
    }
}

@observer
export default class Home extends React.Component<{}, {}> {
    componentWillMount() {
        //store.fetchProjects();
    }
    render() {
        return (
            <DocumentTitle title="Home | Tomatoes Together">
                <div>
                    <Timer
                        task={{title: 'Do the dishes'}}
                    />
                    <CardLayout>
                        <div />
                    </CardLayout>
                </div>
            </DocumentTitle>
        );
    }
}
