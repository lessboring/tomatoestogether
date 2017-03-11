import * as React from 'react';
import * as DocumentTitle from 'react-document-title';
import {observer, inject} from 'mobx-react';
import {observable, ObservableMap, asMap, computed, action} from 'mobx';
import {Link} from 'react-router';
import http from '../http';
import {Store} from '../stores';
import * as models from '../models';
import vm from '../view-model';


@observer
class NewFolderButton extends React.Component<{onClick: any}, {}> {
    render() {
        return (
            <button type="button" onClick={this.props.onClick}>
                <span className="fa-stack">
                    <i className="fa fa-folder-o fa-stack-2x"></i>
                    <i className="fa fa-plus-circle fa-stack-1x"></i>
                </span>
            </button>
        );
    }
}

@observer
class NewProjectButton extends React.Component<{onClick: any}, {}> {
    render() {
        return (
            <button type="button" onClick={this.props.onClick}>
                <span className="fa-stack">
                    <i className="fa fa-bookmark-o fa-stack-2x"></i>
                    <i className="fa fa-plus-circle fa-stack-1x"></i>
                </span>
            </button>
        );
    }
}

@observer
class RenameFolderButton extends React.Component<{onClick: any}, {}> {
    render() {
        return (
            <button type="button" onClick={this.props.onClick}>
                <span className="fa-stack">
                    <i className="fa fa-pencil-square-o fa-stack-2x"></i>
                    <i className="fa fa-plus-circle fa-stack-1x"></i>
                </span>
            </button>
        );
    }
}

@observer
class RenameProjectButton extends React.Component<{onClick: any}, {}> {
    render() {
        return (
            <button type="button" onClick={this.props.onClick}>
                <span className="fa-stack">
                    <i className="fa fa-pencil-square-o fa-stack-2x"></i>
                    <i className="fa fa-plus-circle fa-stack-1x"></i>
                </span>
            </button>
        );
    }
}

@observer
class DeleteFolderButton extends React.Component<{onClick: any}, {}> {
    render() {
        return (
            <button type="button" onClick={this.props.onClick}>
                <i className="fa fa-trash"></i>
            </button>
        );
    }
}

@observer
class DeleteProjectButton extends React.Component<{onClick: any}, {}> {
    render() {
        return (
            <button type="button" onClick={this.props.onClick}>
                <i className="fa fa-trash"></i>
            </button>
        );
    }
}


@inject('store')
@observer
class TreeNode extends React.Component<{
    store?: Store,
    folders: models.Folder[],
    projects: models.Project[],
}, {}> {
    render(): JSX.Element | null {
        return (
            <ul>
                {this.props.folders.map((folder: models.Folder) => (
                    <li key={folder.id}>
                        {folder.name}
                        <br/>
                        <NewFolderButton onClick={(e: any) => this.props.store!.projectsStore.createFolder(folder.id)} />
                        <NewProjectButton onClick={(e: any) => this.props.store!.projectsStore.createProject(folder.id)} />
                        <RenameFolderButton onClick={(e: any) => this.props.store!.projectsStore.renameFolder(folder.id, prompt() || '')} />
                        <DeleteFolderButton onClick={(e: any) => this.props.store!.projectsStore.deleteFolder(folder.id)} />
                        <TreeNode folders={folder.children} projects={folder.projects} />
                    </li>
                ))}
                {this.props.projects.map((project: models.Project) => (
                    <li key={project.id}>
                        <Link to={`/projects/${project.id}`}>
                            {project.name}
                        </Link>
                        <br/>
                        <RenameProjectButton onClick={(e: any) => this.props.store!.projectsStore.renameProject(project.id, prompt() || '')} />
                        <DeleteProjectButton onClick={(e: any) => this.props.store!.projectsStore.deleteProject(project.id)} />
                    </li>
                ))}
            </ul>
        );
    }
}

@inject('store')
@observer
export default class Projects extends React.Component<{store: Store}, {}> {
    componentDidMount() {
        this.props.store!.projectsStore.load();
    }
    render() {
        const store = this.props.store!;
        const projectsStore = store.projectsStore;
        return (
            <div className="row">
                <div className="col-md-3">
                    <h1>Projects</h1>
                    <NewFolderButton onClick={(e: any) => this.props.store!.projectsStore.createFolder(null)} />
                    <TreeNode folders={store.folders} projects={[]} />
                </div>
                <div className="col-md-9">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
