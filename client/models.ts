import {observable} from 'mobx';

class Model {
    constructor(initial: any) {
        for (const key in initial) {
            (this as any)[key] = initial[key];
        }
    }
}

export class User extends Model {
    @observable id: number;
    @observable password?: string;
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
    @observable project_id: number;
    @observable project?: Project;
    @observable tomato_id: number;
    @observable tomato?: Tomato;
    @observable user_id: number;
    @observable user?: User;
    @observable title: string;
    @observable body: string;
}
