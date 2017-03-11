import {observable, extendObservable, ObservableMap, asMap, computed, action} from 'mobx';
import http from './http';
import { browserHistory } from 'react-router';
import * as models from './models';
import * as moment from 'moment';


class LoginForm {
    @observable email: string = '';
    @observable password: string = '';
}

export class LoginStore {
    constructor(public store: Store) {}

    @observable form = new LoginForm();
    @observable loading: boolean = false;

    @action submit = (e: React.SyntheticEvent<{}>) => {
        e.preventDefault();
        this.loading = true;
        http.post('/auth/token/', {
            email: this.form.email,
            password: this.form.password,
        })
        .then(action((response: {token: string}) => {
            localStorage.setItem('token', response.token);
            this.loading = false;
            browserHistory.push('/');
        }))
        .catch(action((error) => {
            alert(JSON.stringify(error));
            this.loading = false;
        }));
    }
}


class SignUpForm {
    @observable email: string = '';
    @observable password: string = '';
    @observable password2: string = '';
}

export class SignUpStore {
    constructor(public store: Store) {}

    @observable form = new SignUpForm();
    @observable loading: boolean = false;

    @action submit = (e: React.SyntheticEvent<{}>) => {
        e.preventDefault();
        this.loading = true;
        http.post('/users/', {
            email: this.form.email,
            password: this.form.password,
        })
        .then(action((userData: UserJSON) => {
            // If the user creation is successful,
            // log in and redirect

            this.store.addMe(userData);
            http.post('/auth/token/', {
                email: this.form.email,
                password: this.form.password,
            })
            .then(action((response: {token: string}) => {
                localStorage.setItem('token', response.token);
                this.loading = false;
                browserHistory.push('/projects');
            }));
        }))
        .catch(action((error) => {
            alert(JSON.stringify(error));
            this.loading = false;
        }));
    }
}

export class ProjectsStore {
    constructor(public store: Store) {}

    @action load() {
        http.get('/folders/')
        .then(action((foldersData: FolderJSON[]) => {
            this.store.addFolders(foldersData);
        }))
        .catch(action((error) => {
            alert(error);
        }));
    }

    @action createFolder(parentId: number | null) {
        http.post('/folders/', {
            name: 'New Folder',
            parent: parentId,
        })
        .then(action((folderData: FolderJSON) => {
            this.store.addFolder(folderData);
        }))
        .catch(action((error) => {
            alert(error);
        }));
    }

    @action createProject(folderId: number | null) {
        http.post('/projects/', {
            name: 'New Project',
            folder: folderId,
        })
        .then(action((projectData: ProjectJSON) => {
            this.store.addProject(projectData);
            browserHistory.push(`/projects/${projectData.id}`);
        }))
        .catch(action((error) => {
            alert(error);
        }));
    }

    @action renameFolder(folderId: number, name: string) {
        http.put(`/folders/${folderId}/`, {name})
        .then(action((res: any) => {
            this.store.getFolder(folderId)!.name = name;
        }))
        .catch(action((error) => {
            alert(error);
        }));
    }

    @action renameProject(projectId: number, name: string) {
        http.put(`/projects/${projectId}/`, {name})
        .then(action((res: any) => {
            this.store.getProject(projectId)!.name = name;
        }))
        .catch(action((error) => {
            alert(error);
        }));
    }

    @action deleteFolder(folderId: number) {
        http.delete(`/folders/${folderId}/`)
        .then(action((res: any) => {
            this.store.foldersById.delete(folderId.toString());
        }))
        .catch(action((error) => {
            alert(error);
        }));
    }

    @action deleteProject(projectId: number) {
        http.delete(`/projects/${projectId}/`)
        .then(action((res: any) => {
            this.store.removeProject(projectId);
        }))
        .catch(action((error) => {
            alert(error);
        }));
    }
}

export class Store {
    @observable loginStore = new LoginStore(this);
    @observable signUpStore = new SignUpStore(this);
    @observable projectsStore = new ProjectsStore(this);

    @observable me: models.User = models.User.anonymous();
    @observable folders: models.Folder[] = [];
    @observable foldersById: ObservableMap<models.Folder> = asMap<models.Folder>({});

    @observable projectsById: ObservableMap<models.Project> = asMap<models.Project>({});
    @observable tasksById: ObservableMap<models.Task> = asMap<models.Task>({});

    getFolder(id: number): models.Folder | null {
        return this.foldersById.get(id.toString()) || null;
    }

    getProject(id: number): models.Project | null {
        return this.projectsById.get(id.toString()) || null;
    }

    @action addMe(initial: UserJSON) {
        const user = new models.User();
        user.email = initial.email;
        user.tomato_break_iframe_url = initial.tomato_break_iframe_url;
        user.timezone = initial.timezone;
        this.me = user;
    }

    @action addFolders(foldersData: FolderJSON[]) {
        for (const folderData of foldersData) {
            const folder = new models.Folder();
            folder.id = folderData.id;
            folder.name = folderData.name;
            this.foldersById.set(folder.id.toString(), folder);
        }

        for (const folderData of foldersData) {
            const folder = this.foldersById.get(folderData.id.toString());
            if (folderData.parent) {
                const parentFolder = this.foldersById.get(folderData.parent.toString());
                parentFolder && parentFolder.children.push(folder);
                folder.parent = parentFolder;
            }
            else {
                this.folders.push(folder);
            }

            if (folderData.projects) {
                for (const projectData of folderData.projects) {
                    this.addProject(projectData);
                }
            }
        }
    }

    @action addFolder(initial: FolderJSON): models.Folder {
        const folder = new models.Folder();
        folder.id = initial.id;
        folder.name = initial.name;
        this.foldersById.set(folder.id.toString(), folder);

        if (initial.parent) {
            const parentFolder = this.foldersById.get(initial.parent.toString());
            parentFolder && parentFolder.children.push(folder);
            folder.parent = parentFolder;
        }
        else {
            this.folders.push(folder);
        }
        return folder;
    }

    @action addProject(initial: ProjectJSON): models.Project {
        const project = new models.Project();
        project.id = initial.id;
        project.name = initial.name;
        this.projectsById.set(project.id.toString(), project);

        if (initial.folder) {
            const folder = this.foldersById.get(initial.folder.toString());
            folder && folder.projects.push(project);
            project.folder = folder;
        }

        if (initial.tasks) {
            this.addTask
        }
        return project;
    }

    @action removeProject(projectId: number) {
        const project = this.projectsById.get(projectId.toString());
        if (project) {
            this.projectsById.delete(projectId.toString());
            const folder = project.folder;
            if (folder) {
                folder.projects = folder.projects.filter((project: models.Project) => project.id !== projectId);
            }
            for (const task of project.tasks) {
                this.removeTask(task.id);
            }
        }
    }

    @action addTask(initial: TaskJSON): models.Task {
        const project = this.projectsById.get(initial.project.toString())
        if (!project) {
            throw new Error('there was a problem');
        }

        const task = new models.Task();
        task.project = project;
        task.id = initial.id;
        task.title = initial.title;
        task.index = initial.index;

        this.tasksById.set(task.id.toString(), task);

        if (initial.parent) {
            const parentTask = this.tasksById.get(initial.parent.toString());
            parentTask && parentTask.children.push(task);
            task.parent = parentTask;
        }
        else {
            project.tasks.push(task);
        }

        return task;
    }

    @action removeTask(taskId: number) {
        const task = this.tasksById.get(taskId.toString());
        if (task) {
            this.tasksById.delete(taskId.toString());
            if (task.parent) {
                this.removeTask(task.parent.id);
            }
        }
    }

    //@action addTomato(initial: TomatoJSON) {
    //    const project = this.projectsById.get(initial.project.toString())
    //    if (project) {
    //        const tomato = new Tomato();
    //        tomato.id = initial.id;
    //        tomato.startTime = initial.startTime;
    //        tomato.project = project;
    //        project.tomatoes.push(tomato);
    //    }
    //}
}

/*
Http requests
Take raw json and put it into the system
    
Retreiving and filtering data
    computeds

*/


/*

let models: {
    users: UserManager;
    projects: ProjectManager;
    tasks: TaskManager;
};


class Model {
    constructor(initial?: any) {
        for (const key in initial) {
            (this as any)[key] = initial[key];
        }
    }
}

class Manager<T extends {id: number}> {
    @observable objects: T[] = [];

    @computed get byId(): ObservableMap<T> {
        const instancesById = asMap<T>({});
        for (const instance of this.objects) {
            instancesById.set(instance.id.toString(), instance);
        }
        return instancesById;
    }

    constructor(public ctor: {new (data: any): T}, initial?: T[]) {
        if (initial) {
            this.objects = initial;
        }
    }

    loadMany(data: any) {
        console.log('here');
        this.objects = data.map((datum: any) => {
            return new this.ctor(datum)
        });
        console.log('here2');
    }

    load(datum: any) {
        this.objects.push(new this.ctor(datum));
    }

    filter(predicate: (instance: T) => boolean): T[] {
        return this.objects.filter(predicate);
    }

    getById(id: number): T | null {
        return this.byId.get(id.toString()) || null;
    }

    get all(): T[] {
        return this.objects;
    }

    get count(): number {
        return this.objects.length;
    }
}

export class UserManager extends Manager<User> {
    @computed get me(): User {
        if (this.count > 0) {
            return this.all[0];
        }
        return new User();
    }
}

export class TaskManager extends Manager<Task> {
}

export class User extends Model {
    @observable id: number = 0;
    @observable email: string = '';
    @observable name: string = 'guest';
    @observable tomato_break_iframe_url: string = '';

}

export class ProjectManager extends Manager<Project> {
}

export class Project {
    @observable id: number;
    @observable name: string;
    @observable parentId: number;

    constructor(initial: any) {
        this.id = initial.id;
        this.name = initial.name;
        this.parentId = initial.parent;
    }

    @computed get parent(): Project | null {
        return models.projects.getById(this.id) || null;
    }

    @computed get children(): Project[] {
        return models.projects.filter((project: Project) => (
            project.parentId === this.id
        ));
    }

    @computed get tasks(): Task[] {
        return models.tasks.filter((task: Task) => (
            task.projectId === this.id
        ));
    }
}

export class Task extends Model {
    @observable id: number = 0;
    @observable projectId: number = 0;
    @observable parentId: number = 0;
    @observable index: number = -1;
    @observable title: string = '';
    @observable collapsed: boolean = false;

    @computed get children(): Task[] {
        return models.tasks.filter((task: Task) => (
            task.parentId === this.id
        ));
    }
}

models = {
    users: new UserManager(User),
    projects: new ProjectManager(Project),
    tasks: new TaskManager(Task),
};

export default models;
*/
