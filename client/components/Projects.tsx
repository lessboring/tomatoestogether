import * as React from 'react';
import * as DocumentTitle from 'react-document-title';
import {observer, inject} from 'mobx-react';
import {observable, ObservableMap, asMap, computed, action} from 'mobx';
import {Link} from 'react-router';
import http from '../http';
import {Store, Project, Task} from '../stores';
import vm from '../view-model';


@observer
class ProjectList extends React.Component<{projects: Project[]}, {}> {
    render(): JSX.Element | null {
        return (
            <ul>
                {this.props.projects.map((project: Project) => (
                    <li key={project.id}>
                        <Link to={`/projects/${project.id}`}>
                            {project.name}
                        </Link>
                        <ProjectList projects={project.children} />
                    </li>
                ))}
            </ul>
        );
    }
}

@inject('store')
@observer
export default class Projects extends React.Component<{store: Store}, {}> {
    render() {
        const store = this.props.store!;
        return (
            <div className="row">
                <div className="col-md-3">
                    <h1>Projects</h1>
                    <ProjectList projects={store.projects} />
                </div>
                <div className="col-md-9">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
