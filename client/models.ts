import {observable, extendObservable, ObservableMap, asMap, computed, action} from 'mobx';
import * as moment from 'moment';

export class User {
    @observable id: number = 0;
    @observable email: string = '';
    @observable name: string = 'guest';
    @observable timezone: string = 'America/New_York';
    @observable tomato_break_iframe_url: string = '';
    @observable projects: Project[] = [];

    static anonymous(): User {
        return new User();
    }
}

export class Tomato {
    @observable id: number = 0;
    @observable startTime: moment.Moment;
    @observable project: Project;

    @computed get endTime() {
        return moment(this.startTime).add(25, 'minutes');
    }
}

export class Folder {
    @observable id: number = 0;
    @observable name: string = '';
    @observable parent: Folder | null = null;
    @observable children: Folder[] = [];
    @observable projects: Project[] = [];
}

export class Project {
    @observable id: number = 0;
    @observable name: string = '';
    @observable tasks: Task[] = [];
    @observable tomatoes: Tomato[] = [];
    @observable folder: Folder | null = null;

    //@computed get totalTomatoes(): number {
    //    if (this.children.length === 0) {
    //        return this.tomatoes.length;
    //    }
    //    else {
    //        let total = this.tomatoes.length;
    //        for (const project of this.children) {
    //            total += project.totalTomatoes;
    //        }
    //        return total;
    //    }
    //}
}

export class Task {
    @observable id: number = 0;
    @observable project: Project | null = null;
    @observable parent: Task | null = null;
    @observable index: number = -1;
    @observable title: string = '';
    @observable collapsed: boolean = false;
    @observable children: Task[] = [];
}
