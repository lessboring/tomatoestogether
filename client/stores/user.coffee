module.exports = types.checkClass class User
    constructor: ->
        @me =
            nickname: 'guest'
            color: 'black'

        @playSound = true

        @users = []



        vm.getUsers = () ->
            socket.emit 'users'

        socket.on 'users', (users) ->
            # TODO: Display the users
            console.log users

