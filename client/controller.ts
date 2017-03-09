import models from './models';
import {observable, ObservableMap, asMap, computed, action} from 'mobx';
import {Project, Task} from './models';
import http from './http';
import vm from './view-model';

class Controller {
    @action getProjects() {
        http.get('/projects/')
        .then(action((projectsData: any) => {
            models.projects.loadMany(projectsData);
        }))
        .catch(action((err: any) => {
            vm.errors.add(err);
        }));
    }

    @action getTasksForProject(projectId: number) {
        http.get(`/projects/${projectId}/`)
        .then(action((projectData: any) => {
            models.tasks.loadMany(projectData.tasks);
        }))
        .catch(action((err: any) => {
            vm.errors.add(err);
        }));
    }

    @action getMe() {
        http.get('/users/me/')
        .then(action((meData: any) => {
            models.users.load(meData);
        }))
        .catch(action((err: any) => {
            vm.errors.add(err);
        }));
    }
}

export default new Controller();
