import {observable, ObservableMap, asMap, computed, action} from 'mobx';
/*
Projects
Tasks

Project can have a parent project
Task can have a parent task
Project has many Tasks


json = {
    id: 1,
    name: 'My project',
    tasks: [{
        id: 2,
        name: 'My task',
    }]
}

Project.load(json)

project = Project.get(1)

console.log(project.name)
project.tasks[0].name

*/

