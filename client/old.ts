import {observable, ObservableMap, asMap, computed, action} from 'mobx';
import * as util from './util';
import {User, Task, Project} from './models';
import http from './http';


class ViewModel {
}


class UserStore {
    @observable me: User = User.empty();

    @computed isLoggedIn() {
        return !!localStorage.getItem('token')
    }

    @action logIn = (email: string, password: password) => {
        http.post('/auth/token/')
        .then(action((res: {token: string}) => {
            localStorage.setItem('token', res.token);
        }))
        .catch(action((err: any) => {
        }));
    }

    @action fetchMe = () => {
        http.get('/users/me/')
        .then(action((userData) => {
            this.user = new User(userData);
            this.loading = false;
            this.errors = {};
        }))
        .catch(action((errors: any) => {
            this.loading = false;
            this.errors = errors;
        }));
    }
    @action logOut = () => {
        localStorage.removeItem('token');
        window.location.href = '';
    }
}

class ProjectStore {

}

export class Store {



    @observable currentTime: Date = new Date();
    @observable minutesLeft: number = 0;
    @observable secondsLeft: number = 0;
    @observable state: TomatoState = 'break';
    @observable user: User = new User();
    @observable loading: boolean = false;
    @observable errors: {[fieldName: string]: string[]} = {};
    @observable operations: Operation[] = [];
    @observable lastOperation: number | null = null;
    // Unsaved task ids are negative, saved are positive
    @observable tasksById: ObservableMap<Task> = asMap<Task>({});
    @observable tasks: Task[] = [];
    @observable nextUnsavedTaskId = -1;
    @observable focusedTaskId: number = 0;

    @action createTask = (parentId: number | null, index: number) => {
        this.operations.push({
            op_type: 'create',
            task_id: --this.nextUnsavedTaskId,
            parent_id: parentId,
            index: index,
            title: '',
            body: '',
        } as CreateOperation);
        this.lastOperation = this.operations.length - 1;
        this.applyNextOperation();
    }

    @action splitTask = (taskId: number) => {
        const currentTask = this.tasksById.get(taskId.toString());
        const caret = window.getSelection().anchorOffset;

        // Truncate the current task to the caret
        this.operations.push({
            op_type: 'update',
            task_id: currentTask.id,
            parent_id: currentTask.parent_id,
            index: currentTask.index,
            title: currentTask.title.slice(0, caret),
            body: currentTask.body,
        } as UpdateOperation);

        // Create a new task with the text after the caret
        this.operations.push({
            op_type: 'create',
            task_id: --this.nextUnsavedTaskId,
            parent_id: currentTask.parent_id,
            index: currentTask.index + 1,
            title: currentTask.title.slice(caret),
            body: '',
        } as CreateOperation);

        this.lastOperation = this.operations.length - 2;
        this.applyNextOperation();
        this.applyNextOperation();
    }

    @action undoLastOperation = () => {
        const op = this.operations[--this.lastOperation];
        if (!op) {
            return;
        }

        switch (op.op_type) {
            case 'create':
                this.undoCreateOperation(op as CreateOperation);
                break;
            case 'update':
                this.undoUpdateOperation(op as UpdateOperation);
                break;
            case 'delete':
                this.undoDeleteOperation(op as DeleteOperation);
                break;
        }
    }

    @action applyNextOperation = () => {
        const op = this.operations[this.lastOperation++];
        if (!op) {
            return;
        }

        switch (op.op_type) {
            case 'create':
                this.applyCreateOperation(op as CreateOperation);
                break;
            case 'update':
                this.applyUpdateOperation(op as UpdateOperation);
                break;
            case 'delete':
                this.applyDeleteOperation(op as DeleteOperation);
                break;
        }

        this.focusedTaskId = op.task_id;
    }

    applyCreateOperation(op: CreateOperation) {
        let entryPoint = (op.parent_id
            ? this.tasksById.get(op.parent_id.toString()).children
            : this.tasks
        );

        const newTask = new Task({
            id: op.task_id,
            parent_id: op.parent_id,
            index: op.index,
            children: [],
            title: op.title,
            body: op.body,
            collapsed: false,
        });
        entryPoint.push(newTask);

        this.tasksById.set(newTask.id.toString(), newTask);
    }
    applyUpdateOperation(op: UpdateOperation) {
        const task = this.tasksById.get(op.task_id.toString());
        // TODO handle parent changing

        // TODO also bump the values of things after this one if index changes
        task.index = op.index;

        task.title = op.title;
        task.body = op.body;
    }
    applyDeleteOperation(op: DeleteOperation) {
    }

    undoCreateOperation(op: CreateOperation) {
    }
    undoUpdateOperation(op: UpdateOperation) {
    }
    undoDeleteOperation(op: DeleteOperation) {
    }

    @action loadTasks = () => {
        this.loading = true;
        http.get('/tasks/')
        .then(action((tasksData: any[]) => {
            this.loading = false;
            this.tasksById.clear();
            this.tasks = [];

            // First create tasks by id to initialize all the incoming tasks
            for (const taskData of tasksData) {
                taskData.children = [];
                this.tasksById.set(taskData.id.toString(), new Task(taskData));
            }

            // Then match up the parent/child relationships
            for (const {id} of tasksData) {
                const task = this.tasksById.get(id);
                
                if (task.parent_id) {
                    const parentTask = this.tasksById.get(task.parent_id.toString());
                    parentTask.children.push(task);
                }
                else {
                    this.tasks.push(task);
                }
            }
        }))
        .catch(action((errors: any) => {
            this.loading = false;
            this.errors = errors;
        }));
    }

    @action tick = () => {
        this.currentTime = new Date();
        [this.minutesLeft, this.secondsLeft, this.state] = util.tomatoTimeFromHourTime(this.currentTime);
    }

    get isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    @computed get formattedTime(): string {
        return util.formatTomatoClock(this.minutesLeft, this.secondsLeft);
    }
    @computed get isTomato(): boolean {
        return this.state === 'tomato';
    }
    @computed get isBreak(): boolean {
        return this.state === 'break';
    }

    @action openModal = (which: ModalState) => {
        this.currentModal = which;
        this.menuExpanded = false;
    }
    @action closeModal = () => {
        this.currentModal = null;
    }
}

export const store = new Store();
setInterval(store.tick, 1000);

if (localStorage.getItem('token')) {
    store.fetchUser();
}

/*
actions = require('client/actions')
types = require('src/types')

String.prototype.replaceAll = (search, replace) ->
    if not replace?
        return @toString()
    @split(search).join(replace)

gongSound = new Audio('gong.mp3')

ringGong = ->
    gongSound.play()

getDate = ->
    date = new Date()
    #date.setMinutes(date.getMinutes() % 5 + 25)
    return date


$ ->
    $('body').tooltip
        selector: '[rel=tooltip]'

    ViewModel = ->
        socket = io.connect(window.location.origin)

        vm = @

        vm.connected = ko.observable(false)
        vm.clock = ko.observable(getDate())
        vm.state = ko.observable(null)
        vm.chatMessages = ko.observableArray([])
        vm.newChatMessage = ko.observable('')
        vm.doneTomatoes = ko.observableArray([])
        vm.nextTomatoTask = ko.observable('')
        vm.nextTomatoTaskInput = ko.observable('')

        vm.pastTomatoes = {}


        ### 
                Template
        ###

        vm.clockHeaderMessage = ko.computed ->
            if vm.state() == 'tomato' then 'Tomato Time!' else 'Break Time!'
        
        
        vm.clockInnerHTML = ko.computed ->
            if vm.state() == 'break' then return '<p>Tell everyone about what you did in the chat until the break timer reaches zero!</p>' else return '<h3>You have not joined this tomato.</h3>'
        
        vm.clockInnerText = ko.computed ->
            if vm.state() == 'break' then return 'Next tomato\'s task:' else return 'Work without distractions until the work timer reaches zero on:'

        vm.debugChatEnable = ko.observable(false)
        vm.debugServerMessages = ko.observable(false)

        # This is also used in templates
        vm.chatEnabled = ->
            if vm.debugChatEnable() then return true
            return vm.connected() and vm.state() == 'break'

        vm.tick = ->
            vm.clock(getDate())

        vm.formattedClock = ko.computed ->
            return util.formatCurrentTime(vm.clock())

        vm.formattedTime = ko.computed ->
            [minutesLeft, secondsLeft, state] = util.tomatoTimeFromHourTime(vm.clock())
            if vm.state()? and vm.state() != state
                if vm.playSound()
                    ringGong()
                if state == 'break'
                    # Finish the current tomato if there is one
                    vm.finishTomato()
            vm.state(state)
            return util.formatTomatoClock(minutesLeft, secondsLeft)


        ### 
                Emotes
        ###

        emoteSrc = (emoteFile) ->
            return '<img src="emotes/' + emoteFile + '.png"/>'


        ###
                Messages
        ###

        vm.addMessage = (message) ->
            for emoteKeyword, emoteFile of emotes
                message.body = message.body.replaceAll(emoteKeyword, emoteSrc(emoteFile))

            message.body = Autolinker.link(message.body, { stripPrefix: false })
            message.timestamp = new Date(message.timestamp)

            if message.body.trim().length != 0
                vm.chatMessages.push(message)
                scrollChatToBottom()

        vm.addServerMessage = (text) ->
            if vm.debugServerMessages()
                vm.addMessage({template: 'Server', nick: 'server', timestamp: new Date(), body: text})



        # TODO: Never send message to the server
        socket.on 'slow-down', () ->
            vm.addServerMessage('You\'re sending messages too quickly.')



        vm.getMyInfo = () ->
            socket.emit 'myinfo'

        socket.on 'myinfo', (info) ->
            vm.nick(info.nick)

        vm.setMyInfo = (userinfo) ->
            socket.emit 'setmyinfo', userinfo



socket.on(name, callback) for name, callback of actions
setInterval(actions.tick, 1000)
actions.load()
m.mount document.getElementById('app'), app
*/
