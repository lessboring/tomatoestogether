module.exports = types.checkClass class Tomato
    constructor: ->
        @current
        @tomatoes: []

    completed: ->
        @tomatoes

    current: ->
        @current


    start

        vm.todaysTomatoes = ko.computed ->
            todays = []
            today = getDate().toDateString()
            for tomato in vm.doneTomatoes()
                if tomato.day == today
                    todays.push(tomato)
            return todays

