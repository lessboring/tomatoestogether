types = require('src/types')


module.exports = types.checkClass class Chat
    types:
        messages: ['Message']
        newMessage: 'String'

    constructor: ->
        @messages: []
        @newMessage = ''

    getNewMessage: ->
        @newMessage

    clearNewMessage: ->
        @newMessage = ''

    addMessage_: ['Message', 'Void']
    addMessage: (message) ->
        @messages.push(message)
