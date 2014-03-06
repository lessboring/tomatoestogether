util = require('util')

String.prototype.replaceAll = (search, replace) ->
    if not replace?
        return @toString()
    @split(search).join(replace)

gongSound = new Audio('gong.mp3')

ringGong = ->
    gongSound.play()

scrollChatToBottom = ->
    $('.chat-container').stop().animate({
        scrollTop: $('.chat-container')[0].scrollHeight
    }, 800)
    
ko.bindingHandlers.checkbox =
    init: (element, valueAccessor, allBindings, data, context) ->
        observable = valueAccessor()

        if not ko.isWriteableObservable(observable)
            throw "You must pass an observable or writeable computed"

        $element = $(element)

        $element.on "click", ->
            observable not observable()
            return

        ko.computed disposeWhenNodeIsRemoved: element, read: ->
            $element.toggleClass "active", observable()
            return

        return

getDate = ->
    date = new Date()
    #date.setMinutes(date.getMinutes() % 5 + 25)
    return date


emotes =
    'Kappa': 'kappa'
    'Colgan': 'colgan'
    'NGCCG': 'ngccg'
    ':O': 'shocked'
    'FrankerZ': 'frankerz'
    'YOLOSwag': 'swag'
    'JordanFitz': 'jordanfitz'
    'BeExcellent': 'lincoln'
    'Grrrr': 'brooding'
    'BigBrother': 'bigbrother'
    'Tinfoilboy': 'tinfoilboy'
    'FrankerQ': 'fitzdog'
    'NoHair': 'nohair'
    'OneTomato': 'tomato'
    'Dooskington': 'dooskington'


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
        
        vm.clockBreakTime = ko.computed -> 
            if vm.state() == 'break' then 'clock break' else 'clock work'
        
        vm.clockInnerHTML = ko.computed ->
            if vm.state() == 'break' then return '<p>Tell everyone about what you did in the chat until the break timer reaches zero!</p>' else return '<h3>You have not joined this tomato.</h3>'
        
        vm.clockInnerText = ko.computed ->
            if vm.state() == 'break' then return 'Next tomato\'s task:' else return 'Work without distractions until the work timer reaches zero on:'

        vm.messageTemplateToUse = (item) ->
            if item.template == 'Server' then return 'serverMessage'
            return 'defaultMessage'


        ###
                Debug Stuff
        ###

        vm.debugChatEnable = ko.observable(false)
        vm.debugServerMessages = ko.observable(false)

        # This is also used in templates
        vm.chatEnabled = ->
            if vm.debugChatEnable() then return true
            return vm.connected() and vm.state() == 'break'


        ###
                Storage
        ###

        vm.nick = ko.observable('guest')
        vm.userColor = ko.observable('#000000')
        vm.playSound = ko.observable(true)

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


        ###
                Tomato 
        ###

        vm.joinNextTomato = ->
            vm.nextTomatoTask(vm.nextTomatoTaskInput())
            vm.nextTomatoTaskInput('')

        vm.finishTomato = ->
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


        ###
                Clock time
        ###

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
                Completed Tomatoes
        ###

        vm.todaysTomatoes = ko.computed ->
            todays = []
            today = getDate().toDateString()
            for tomato in vm.doneTomatoes()
                if tomato.day == today
                    todays.push(tomato)
            return todays


        ### 
                Emotes
        ###

        emoteSrc = (emoteFile) ->
            return '<img src="emotes/' + emoteFile + '.png"/>'


        ###
                Messages
        ###

        vm.sendMessage = (form) ->
            socket.emit 'message',
                nick: vm.nick()
                body: vm.newChatMessage()
                userColor: vm.userColor()
            vm.newChatMessage('')

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


        ###

        ###

        # Initial connection message
        socket.on 'welcome', (data) ->
            vm.connected(true)
            for message in data.messages
                vm.addMessage(message)

        # New message
        socket.on 'message', (message) ->
            vm.addMessage(message)

        # TODO: Never send message to the server
        socket.on 'slow-down', () ->
            vm.addServerMessage('You\'re sending messages too quickly.')            


        ### 
                Users
        ###

        vm.getUsers = () ->
            socket.emit 'users'

        socket.on 'users', (users) ->
            # TODO: Display the users
            console.log users


        ### 
                Client Info
        ###

        vm.updateMyInfo = (ko.computed ->
            # TODO: Don't update when the oldValue is the same
            #console.log 'update info { nick: ' + vm.nick() + ' }'
            socket.emit 'setmyinfo', { nick: vm.nick() }
        , this).extend({ notify2: (a, b) -> return a != b; })

        vm.getMyInfo = () ->
            socket.emit 'myinfo'

        socket.on 'myinfo', (info) ->
            vm.nick(info.nick)

        vm.setMyInfo = (userinfo) ->
            socket.emit 'setmyinfo', userinfo


        ###
                Server Messages
        ###

        socket.on 'user_con', (info) ->
            vm.addServerMessage('<b>' + info.nick + '</b> connected.')

        socket.on 'user_dis', (info) ->
            vm.addServerMessage('<b>' + info.nick + '</b> disconnected.')

        # Message from server
        socket.on 'notice', (message) ->
            vm.addServerMessage(message)


        ###
                Initiate Server Connection
        ###

        vm.restoreFromLocalStorage()

        socket.on 'identify', ->
            socket.emit 'identify', {nick: vm.nick(), userColor: vm.userColor()}


        ###

        ###

        # Set the clock update timer
        setInterval(vm.tick, 1000)

        window.vm = vm
        null

    ko.applyBindings(new ViewModel)

