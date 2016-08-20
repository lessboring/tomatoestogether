m = require('mithril')


Header =
    view: ->
        m '.row',
            m '.col-xs-6',
                m 'h1', 'Tomatoes Together!'
            m '.col-xs-6',
                m 'p', 'Working by yourself can lead to a lack of motivation. But working around others can be distracting.  So do 25 minutes of focused work, and then take a 5 minute break to tell everyone about how it went!  Work periods start on the hour and half past the hour.'


Preferences =
    view: ->
        m 'input[type=text][placeholder=username]',
            style:
                color: '#' + me.color
            value: me.username

        m 'input[type=text][placeholder=color]',
            style:
                color: '#' + me.color
            value: me.color


TimerDisplay =
    view: ->
        m '.tomato-display',
            style:
                backgroundColor: if duringTomato then 'red' else 'green'
            timer.timeLeft


module.exports = App =
    view: ->
        m '.container',
            m Header
            m '.row',
                m '.col-xs-6',
                    #m Preferences
                    #m TimerDisplay
                    #m TomatoTaskInput
                m '.col-xs-6',
                    #m ChatDisplay
                    #m ChatInput
            m '.row',
                m '.col-xs-6',
                    #m CompletedTomatoesDisplay
                m '.col-xs-6',
                    #m OtherUsersDisplay
