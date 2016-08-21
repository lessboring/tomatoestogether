module.exports =
    connected: ->
        myId = localStorage.getItem('myId') or null

        # Send the server our id if we have it
        socket.emit('join', {myId})

    confirmed: ->
        # Receive all information about our user if it was still there
        # other users
        # current tomato task state (during/break)
    
    changeMyUser: ({ username, color, tomatoTask }) ->
        # Change our username and send it to the server

        m.redraw()

    sendMessage: ->
        # Send a chat message to the server

    receiveMessage: ->
        # Receive a chat message and display it, including ones we've sent before

    otherUserJoined: ->
        # Receive information about a user including id, nickname, color, and current tomato task
    otherUserLeft: ->
        # Remove this user from our list of users

    otherUserChanged: ->
        # Update user with new nickname, color, and tomato task
