m = require('mithril')


Header =
    view: ->
        m '.header',
            m '.row',
                m '.col-xs-6',
                    m 'h1.text-xs-center', 'Tomatoes Together!'
                m '.col-xs-6',
                    m 'p', 'Working by yourself can lead to a lack of motivation. But working around others can be distracting.  So do 25 minutes of focused work, and then take a 5 minute break to tell everyone about how it went!  Work periods start on the hour and half past the hour.'


Preferences =
    view: ->
        m '.preferences',
            m '.row',
                m '.col-xs-5',
                    m '.input-group',
                        m 'span.input-group-addon', 'Chat Name'
                        m 'input[type=text][placeholder=username].form-control',
                            style:
                                color: '#008800'
                            value: 'dvcolgan'
                m '.col-xs-5',
                    m '.input-group',
                        m 'span.input-group-addon', 'Chat Color'
                        m 'input[type=text][placeholder=color].form-control',
                            style:
                                color: '#008800'
                            value: '#008800'
                m '.col-xs-2',
                    m 'button[type=button].btn.btn-default.btn-block', 'Mute'


TimerDisplay =
    view: ->
        m '.card',
            m '.timer-display.work',
                m 'h2', 'Tomato Time!'
                m '.clock-face', '6:32'
                m 'h3', 'You have not yet joined this tomato'


TomatoTaskInput =
    view: ->
        m '.tomato-task-input',
            m 'form.input-group',
                m 'input.form-control[type=text]',
                    placeholder: 'During this tomato I am going to...'
                m 'span.input-group-btn',
                    m 'button[type=submit].btn.btn-success', 'Join'


ChatDisplay =
    view: ({ messages=[
        { username: 'dvcolgan', body: 'hello', timestamp: '4:13' },
        { username: 'denaje', body: 'hello', timestamp: '4:13' },
        { username: 'dvcolgan', body: 'hello', timestamp: '4:13' },
        { username: 'denaje', body: 'hello', timestamp: '4:13' },
        { username: 'dvcolgan', body: 'hello', timestamp: '4:13' },
        { username: 'denaje', body: 'hello', timestamp: '4:13' },
    ] }) ->
        m '.chat-display',
            m 'h2', 'Tell everyone about your work:'
            m '.chat-messages.card',
                for message in messages
                    m '.chat-message',
                        m 'span', message.timestamp
                        ' '
                        m 'strong', message.username + ':'
                        ' '
                        m 'span', message.body


ChatInput =
    view: ->
        m 'div',
            m 'input[type=text][placeholder=Chat your message...]'
            m 'button', 'Chat'
    view: ->
        m '.chat-input',
            m 'form.input-group',
                m 'input.form-control[type=text]'
                m 'span.input-group-btn',
                    m 'button[type=submit].btn.btn-primary', 'Chat'


CompletedTomatoesDisplay =
    view: ->
        m 'div',
            m 'h3', 'Today\'s Completed Tomatoes'
            for i in [0..10]
                m '.done-tomato', i


OtherUsersDisplay =
    view: ->
        m 'div',
            m 'h3', 'Fellow Tomatoers'
            m 'ul',
                m 'li', 'dvcolgan: Building a client'
                m 'li', 'denaje: Building a server'
                m 'li', 'dooskington: Bulding a C++ game'
                m 'li', 'tinfoilboy: Building a Java game'
                m 'li', 'tyren: Building an OS'


Footer =
    view: ->
        m '.footer',
            m '.container.text-muted',
                'An experiment by'
                m 'a[href=https://twitter.com/davidscolgan]',
                    '@davidscolgan'


module.exports = App =
    view: ->
        m 'div',
            m Header
            m '.container-fluid',
                m '.row',
                    m '.col-xs-6',
                        m Preferences
                        m TimerDisplay
                        m TomatoTaskInput
                    m '.col-xs-6',
                        m ChatDisplay
                        m ChatInput
                m '.row',
                    m '.col-xs-6',
                        m CompletedTomatoesDisplay
                    m '.col-xs-6',
                        m OtherUsersDisplay
            m Footer
