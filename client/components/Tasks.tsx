import * as React from 'react';
import * as DocumentTitle from 'react-document-title';
import {observer, inject} from 'mobx-react';
import {Link} from 'react-router';
import vm from '../view-model';
import ContentEditable from './ContentEditable';
import {Store, Project, Task} from '../stores';


@observer
class TaskNode extends React.Component<{task: Task}, {}> {
    render(): JSX.Element | null {
        const {task} = this.props;
        const focus = (vm.focusedTaskId === this.props.task.id);
        return (
            <div className="task" style={{
                backgroundColor: focus ? 'green' : 'white'
            }} >
                <div className="task-bullet" onClick={() => task.collapsed = !task.collapsed}></div>
                <ContentEditable
                    focused={focus}
                    className="task-title"
                    html={task.title}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            //store.splitTask(task.id);
                        }
                    }} 
                    onChange={(html) => {
                        task.title = html;
                    }}
                />
                {!task.collapsed && (
                    task.children.map((task: Task) => (
                        <TaskNode key={task.id} task={task} />
                    ))
                )}
            </div>
        );
    }
}

@inject('store')
@observer
export default class Tasks extends React.Component<{store?: Store, params: {projectId: number}}, {}> {
    render() {
        const project = this.props.store!.getProject(this.props.params.projectId);
        return (
            <div>
                <h1>{project && project.name} Tasks</h1>
                <div className="tasks">
                    {project && project.tasks.map((task: Task) => (
                        <TaskNode key={task.id} task={task} />
                    ))}
                </div>
            </div>
        );
    }
}
