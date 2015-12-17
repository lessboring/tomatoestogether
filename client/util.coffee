types = require('client/types')


module.exports = types.checkModule
    padWithZero_: ['Number', 'String']
    padWithZero: (num) ->
        if num.toString().length == 1
            '0' + num.toString()
        else
            num.toString()

    tomatoTimeFromHourTime_: ['Date', ['Number', 'Number', 'String']]
    tomatoTimeFromHourTime: (currentTime) ->
        minutes = currentTime.getMinutes()
        seconds = currentTime.getSeconds()
        minutesLeft = 0
        state = null

        if minutes >= 55
            minutesLeft = 5 - (minutes - 55) - 1
            state = 'break'
        else if minutes >= 30
            minutesLeft = 25 - (minutes - 30) - 1
            state = 'tomato'
        else if minutes >= 25
            minutesLeft = 5 - (minutes - 25) - 1
            state = 'break'
        else
            minutesLeft = 25 - minutes - 1
            state = 'tomato'
        secondsLeft = 60 - seconds - 1
        [minutesLeft, secondsLeft, state]

    formatCurrentTime_: ['Date', 'String']
    formatCurrentTime: (date) ->
        hours = date.getHours()
        minutes = date.getMinutes()
        seconds = date.getSeconds()
        hours + ':' + padWithZero(minutes) + ':' + padWithZero(seconds)

    formatTomatoClock_: ['Number', 'Number', 'String']
    formatTomatoClock: (minutesLeft, secondsLeft) ->
        "#{minutesLeft}:#{padWithZero(secondsLeft)}"
