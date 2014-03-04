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

        vm.clockHeaderMessage = ko.computed ->
            if vm.state() == 'tomato' then 'Tomato Time!' else 'Break Time!'

        vm.clockBreakTime = ko.computed -> 
            if vm.state() == 'break' then 'clock break' else 'clock work'

        vm.clockInnerHTML = ko.computed ->
            if vm.state() == 'break' then 
                '<p>Tell everyone about what you did in the chat until the break timer reaches zero!</p>' 
            else 
                '<h3>You have not joined this tomato.</h3>'

        vm.clockInnerText = ko.computed ->
            if vm.state() == 'break' then 
                'Next tomato\'s task:' 
            else 
                'Work without distractions until the work timer reaches zero on:'


        # Things to save
        vm.username = ko.observable('guest')
        vm.userColor = ko.observable('#000000')
        vm.playSound = ko.observable(true)


        vm.joinNextTomato = ->
            vm.nextTomatoTask(vm.nextTomatoTaskInput())
            vm.nextTomatoTaskInput('')

        vm.finishTomato = ->
            if vm.nextTomatoTask() != ''
                vm.doneTomatoes.push
                    task: vm.nextTomatoTask()
                    day: getDate().toDateString()
                socket.emit 'message',
                    username: vm.username()
                    body: "My tomato task: " + vm.nextTomatoTask()
                    userColor: vm.userColor()

                vm.nextTomatoTask('')


        vm.restoreFromLocalStorage = ->
            saved = localStorage.getItem('tomatoestogether')
            if saved?
                console.log 'Reading from localStorage' + saved
                saved = JSON.parse(saved)
                vm.username(saved.username or 'guest')
                vm.userColor(saved.userColor or '#000000')
                vm.doneTomatoes(saved.doneTomatoes or [])
                if saved.playSound?
                    vm.playSound(saved.playSound)

            # This has to be done after the values are read
            # or they will be overwritten
            vm.saveToLocalStorage = ko.computed ->
                console.log 'Saving to localStorage.'
                saved =
                    username: vm.username()
                    userColor: vm.userColor()
                    playSound: vm.playSound()
                    doneTomatoes: vm.doneTomatoes()
                console.log saved
                localStorage.setItem('tomatoestogether', JSON.stringify(saved))

        vm.tick = ->
            vm.clock(getDate())

        vm.formattedClock = ko.computed ->
            return util.formatCurrentTime(vm.clock())

        vm.todaysTomatoes = ko.computed ->
            todays = []
            today = getDate().toDateString()
            for tomato in vm.doneTomatoes()
                if tomato.day == today
                    todays.push(tomato)
            return todays

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

        vm.sendMessage = (form) ->
            socket.emit 'message',
                username: vm.username()
                body: vm.newChatMessage()
                userColor: vm.userColor()
            vm.newChatMessage('')

        emoteSrc = (emoteFile) ->
            return '<img src="emotes/' + emoteFile + '.png"/>'

        vm.addMessage = (message) ->
            for emoteKeyword, emoteFile of emotes
                message.body = message.body.replaceAll(emoteKeyword, emoteSrc(emoteFile))
            message.body = Autolinker.link(message.body, { stripPrefix: false })

            message.timestamp = new Date(message.timestamp)

            if message.body.trim().length != 0
                vm.chatMessages.push(message)
                scrollChatToBottom()


        setInterval(vm.tick, 1000)

        socket.on 'hello', (data) ->
            vm.connected(true)
            for message in data.messages
                vm.addMessage(message)
        socket.on 'message', (message) ->
            vm.addMessage(message)

        socket.on 'slow-down', () ->
            vm.addMessage({username: 'Server', timestamp: new Date(), body: "You're sending messages too quickly.", userColor: '#000'})            

        vm.restoreFromLocalStorage()

        window.vm = vm
        null

    ko.applyBindings(new ViewModel)

