import * as React from 'react';
import * as DocumentTitle from 'react-document-title';
import {observer, inject} from 'mobx-react';
import {observable, ObservableMap, asMap, computed, action} from 'mobx';
import {Link} from 'react-router';
import http from '../http';
import {Store, Project, Task, Tomato} from '../stores';
import vm from '../view-model';
import {times} from '../util';


@observer
class ProjectList extends React.Component<{projects: Project[]}, {}> {
    render(): JSX.Element | null {
        return (
            <ul>
                {this.props.projects.map((project: Project) => (
                    <li key={project.id}>
                        {project.name}
                        {times<JSX.Element>(
                            project.tomatoes.length,
                            (i: number) => (
                                <img key={i} src="/assets/tomato.png" />
                            )
                        )}
                        <ProjectList projects={project.children} />
                    </li>
                ))}
            </ul>
        );
    }
}

@inject('store')
@observer
export default class Stats extends React.Component<{store: Store}, {}> {
    render() {
        const store = this.props.store!;
        return (
            <div className="row">
                <div className="col-md-12">
                    <h1>Tomatoes Per Project</h1>
                    <ProjectList projects={store.projects} />
                </div>
            </div>
        );
    }
}
