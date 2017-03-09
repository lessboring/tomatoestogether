import {observable, extendObservable, ObservableMap, asMap, computed, action} from 'mobx';
import * as moment from 'moment';


export class User {
    @observable id: number = 0;
    @observable email: string = '';
    @observable name: string = 'guest';
    @observable tomato_break_iframe_url: string = '';
    @observable projects: Project[] = [];

    constructor(public store: Store) {}
}


export class Tomato {
    @observable id: number = 0;
    @observable startTime: moment.Moment;
    @observable project: Project;

    @computed get endTime() {
        return moment(this.startTime).add(25, 'minutes');
    }

    constructor(public store: Store) {}
}

export class Project {
    @observable id: number = 0;
    @observable name: string = '';
    @observable parent: Project | null = null;
    @observable children: Project[] = [];
    @observable tasks: Task[] = [];
    @observable tomatoes: Tomato[] = [];

    constructor(public store: Store) {}

    @computed get totalTomatoes(): number {
        if (this.children.length === 0) {
            return this.tomatoes.length;
        }
        else {
            let total = this.tomatoes.length;
            for (const project of this.children) {
                total += project.totalTomatoes;
            }
            return total;
        }
    }
}


export class Task {
    @observable id: number = 0;
    @observable project: Project | null = null;
    @observable parent: Task | null = null;
    @observable index: number = -1;
    @observable title: string = '';
    @observable collapsed: boolean = false;
    @observable children: Task[] = [];

    constructor(public store: Store) {}
}

interface ProjectJSON {
    id: number;
    name: string;
    parent?: number;
}
interface TaskJSON {
    id: number;
    project: number;
    parent?: number;
    index: number;
    title: string;
    completed: boolean;
}

interface TomatoJSON {
    id: number;
    project: number;
    startTime: moment.Moment;
}


export class Store {
    @observable projects: Project[] = [];
    @observable projectsById: ObservableMap<Project> = asMap<Project>({});
    @observable tasksById: ObservableMap<Task> = asMap<Task>({});

    getProject(id: number): Project | null {
        return this.projectsById.get(id.toString()) || null;
    }

    @action addProject(initial: ProjectJSON) {
        const project = new Project(this);
        project.id = initial.id;
        project.name = initial.name;
        this.projectsById.set(project.id.toString(), project);

        if (initial.parent) {
            const parentProject = this.projectsById.get(initial.parent.toString());
            parentProject && parentProject.children.push(project);
            project.parent = parentProject;
        }
        else {
            this.projects.push(project);
        }
    }

    @action addTask(initial: TaskJSON) {
        const project = this.projectsById.get(initial.project.toString())
        if (project) {
            const task = new Task(this);
            task.id = initial.id;
            task.project = project;
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
        }
    }

    @action addTomato(initial: TomatoJSON) {
        const project = this.projectsById.get(initial.project.toString())
        if (project) {
            const tomato = new Tomato(this);
            tomato.id = initial.id;
            tomato.startTime = initial.startTime;
            tomato.project = project;
            project.tomatoes.push(tomato);
        }
    }
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
