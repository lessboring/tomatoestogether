import {observable, computed, action} from 'mobx';
import * as util from './util';
import * as types from './types';
import * as models from './models';
import http from './http';


class ProjectStore {
    @observable loading: boolean = false;
    @observable projects: models.Project[] = [];

    @action fetchProjects = () => {
        this.loading = true;
        http.get('/projects')
        .then(action((projectsData: any) => {
            this.projects = [];
            for (const projectData of projectsData) {
                this.projects.push(new models.Project(projectData));
            }
            this.loading = false;
        }))
    }

    @action fetchProjectTasks = (projectId: number) => {
        http.get(`/projects/${projectId}`)
        .then(action((projectData: any) => {
            this.projects = [];
            //for (const projectData of projectsData) {
            //    this.projects.push(new models.Project(projectData));
            //}
            this.loading = false;
        }))
    }
}

class Store {
    @observable menuExpanded: boolean = false;
    @observable currentTime: Date = new Date();
    @observable minutesLeft: number = 0;
    @observable secondsLeft: number = 0;
    @observable state: types.TomatoState = 'break';
    @observable projects: ProjectStore = new ProjectStore();

    @action toggleMenu = () => {
        this.menuExpanded = !this.menuExpanded;
    }

    @action tick = () => {
        this.currentTime = new Date();
        [this.minutesLeft, this.secondsLeft, this.state] = util.tomatoTimeFromHourTime(this.currentTime);
    }

    @computed get formattedTime(): string {
        return util.formatTomatoClock(this.minutesLeft, this.secondsLeft);
    }

}

const store = new Store();

setInterval(store.tick, 1000);

export default store;
