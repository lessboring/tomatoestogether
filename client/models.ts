import {observable} from 'mobx';

class Model {
    constructor(initial?: any) {
        for (const key in initial) {
            (this as any)[key] = initial[key];
        }
    }
}

export class User extends Model {
    @observable id: number;
    @observable email: string;
    @observable name: string;
    @observable tomato_break_iframe_url: string;

    static empty(): User {
        return new User({
            id: 0,
            email: '',
            name: '',
            tomato_break_iframe_url: '',
        });
    }
}

export class Project extends Model {
    @observable id: number;
    @observable name: string;
    @observable tasks?: Project[];
}

export class Tomato extends Model {
    @observable id: number;
    @observable user_id: number;
    @observable user?: User;
    @observable start: Date;
    @observable project_id: number;
    @observable project?: Project;
}

export class Task extends Model {
    @observable id: number;
    @observable parent_id: number;
    @observable children: Task[];
    @observable title: string;
    @observable body: string;

    static empty(): Task {
        return new Task({
            id: 0,
            parent_id: 0,
            children: [],
            title: '',
            body: '',
        });
    }
}
