m = require('mithril')
axios = require('axios')
types = require('src/types')
stores = require('src/stores')
socket = require('src/socket')


module.exports = types.checkModule
    connect_: ['Void']
    connect: ->

    login_: ['String', 'String', 'Void']
    login: (username, password) ->


        socket.on 'identify', ->
            socket.emit 'identify', {nick: vm.nick(), userColor: vm.userColor()}

        # Message from server
        socket.on 'notice', (message) ->
            vm.addServerMessage(message)


        socket.on 'user_con', (info) ->
            vm.addServerMessage('<b>' + info.nick + '</b> connected.')

        socket.on 'user_dis', (info) ->
            vm.addServerMessage('<b>' + info.nick + '</b> disconnected.')


    load: ->
        vm.restoreFromLocalStorage = ->
            saved = localStorage.getItem('tomatoestogether')
            if saved?
                saved = JSON.parse(saved)
                vm.nick(saved.nick or 'guest')
                vm.userColor(saved.userColor or '#000000')
                vm.doneTomatoes(saved.doneTomatoes or [])
                if saved.playSound?
                    vm.playSound(saved.playSound)

            # This has to be done after the values are read
            # or they will be overwritten
            vm.saveToLocalStorage = ko.computed ->
                #console.log 'Saving to localStorage.'
                saved =
                    nick: vm.nick()
                    userColor: vm.userColor()
                    playSound: vm.playSound()
                    doneTomatoes: vm.doneTomatoes()
                localStorage.setItem('tomatoestogether', JSON.stringify(saved))

    joinNextTomato = ->
        vm.nextTomatoTask(vm.nextTomatoTaskInput())
        vm.nextTomatoTaskInput('')

    finishTomato = ->
        if vm.nextTomatoTask() != ''
            vm.doneTomatoes.push
                task: vm.nextTomatoTask()
                day: getDate().toDateString()
            # TODO: This should be done differently 
            socket.emit 'message',
                nick: vm.nick()
                body: "My tomato task: " + vm.nextTomatoTask()
                userColor: vm.userColor()

            vm.nextTomatoTask('')

    socket.on 'welcome', 
    welcome: (data) ->
        vm.connected(true)
        for message in data.messages
            vm.addMessage(message)

    vm.updateMyInfo: ->
        socket.emit 'setmyinfo', { nick: vm.nick() }
    , this).extend({ notify2: (a, b) -> return a != b; })

    receiveMessage_: ['Message', 'Void']
    receiveMessage: (message) ->
        Chat.addMessage(message)

    sendMessage: ->
        socket.emit 'newMessage',
            body: Chat.getNewMessage()
            nickname: User.getMyNickname()
            color: User.getMyColor()
        Chat.clearNewMessage()
