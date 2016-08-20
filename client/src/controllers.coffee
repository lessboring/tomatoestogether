module.exports =
    connected: ->
        # Send the server our id if we have it
    confirmed: ->
        # Receive all information about our user if it was still there
        # other users
        # current tomato task state (during/break)
    
    changeUsername: ->
        # Change our username and send it to the server

    changeColor: ->
        # Change our color and send it to the server

    changeTomatoTask: ->
        # Change our tomato task and send it to the server

    sendMessage: ->
        # Send a chat message to the server

    receiveMessage: ->
        # Receive a chat message and display it, including ones we've sent before

    otherUserJoined: ->
        # Receive information about a user including id, nickname, color, and current tomato task
    otherUserLeft: ->
        # Remove this user from our list of users

    otherUserChangedUsername: ->
        # Update user with new nickname

    otherUserChangedColor: ->
        # Update user with new color

    otherUserChangedTomatoTask: ->
        # Update user with new tomato task

