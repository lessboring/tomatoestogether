import {observable, computed, action} from 'mobx';
import * as util from './util';
import * as types from './types';
import * as models from './models';
import http from './http';

/*
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
*/

export type ModalState = 'login' | 'upgrade' | 'settings' | null;

export class Store {
    @observable menuExpanded: boolean = false;
    @observable currentTime: Date = new Date();
    @observable minutesLeft: number = 0;
    @observable secondsLeft: number = 0;
    @observable state: types.TomatoState = 'break';
    @observable currentModal: ModalState = null;

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

    @action openModal = (which: ModalState) => {
        this.currentModal = which;
    }
    @action closeModal = () => {
        this.currentModal = null;
    }
}

export const store = new Store();
setInterval(store.tick, 1000);


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
