module.exports =
    saveCompletedTomato: (tomato) ->
        storage = JSON.parse(localStorage.getItem('tomatoestogether'))
        if not storage.tomatoes?
            storage.tomatoes = []

        storage.tomatoes.append(tomato)

        localStorage.setItem(JSON.stringify(storage))

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

