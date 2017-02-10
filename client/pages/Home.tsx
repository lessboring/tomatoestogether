import * as React from 'react';
import * as DocumentTitle from 'react-document-title';
import {CardLayout} from '../components/Layouts';
import vm from '../view-model';
import {observer} from 'mobx-react';
import {Link} from 'react-router';


class HomeStore {

}


interface Task {
    title: string;
}


@observer
class TimeDisplay extends React.Component<{}, {}> {
    render() {
        return (
            <div className="time-display">
                {vm.formattedTime}
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
            <div className={'timer ' + vm.state}>
                <TimeDisplay />
                <TaskDisplay task={this.props.task} />
            </div>
        );
    }
}

@observer
export default class Home extends React.Component<{}, {}> {
    store = new HomeStore();
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
