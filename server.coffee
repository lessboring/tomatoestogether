http = require('http')
path = require('path')
express = require('express')
Encoder = require('node-html-encoder').Encoder

app = new express()

app.set('port', process.env.PORT or 3000)
app.set('views', path.join(__dirname, '/templates'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.favicon())
app.use(express.logger('dev'))
app.use(express.json())
app.use(express.bodyParser())
app.use(express.urlencoded())
app.use(express.methodOverride())
app.use(express.cookieParser())
app.use(require('connect-slashes')(false))
app.use(app.router)

if 'development' == app.get('env')
    app.use(express.errorHandler())

app.get '/', (req, res) ->
    res.sendfile(__dirname + '/templates/index.html')


# Where should I place this?
MaxMessageHistory = 100


server = http.createServer(app)
io = require('socket.io').listen(server)
server.listen(app.get('port'))

messageHistory = []
connectedUsers = []
waitingUsers = []
usernames = []

ensureMessageIsShort = (message) ->
    if message.length > 255
        return message[...255]
    return message

encoder = new Encoder('entity')
escapeHTML = (message) ->
    return encoder.htmlEncode(message)

propertyOf = (array, property, value) ->
    for i in [0 .. array.length]
        if array[i][property] == value
            return i
    return -1

io.sockets.on 'connection', (socket) ->
<<<<<<< HEAD

    userinfo = {}
    userinfo.userid = socket.id
    userinfo.nick = 'guest'
    userinfo.usercolor = '#000000'

=======
>>>>>>> master
    socket.emit('hello', { status: 'connected', messages: messageHistory })

    socket.on 'message', (message) ->
        message.body = ensureMessageIsShort(message.body)
        message.body = escapeHTML(message.body)
        message.timestamp = new Date()
        messageHistory.push(message)
        messageHistory.splice(0, messageHistory.length - MaxMessageHistory)
        
        console.log message

        allow = () ->
            waitingUsers.splice waitingUsers.indexOf(message.username), 1
            null

        if message.body.trim().length != 0
            if waitingUsers.indexOf(message.username) == -1
                io.sockets.emit('message', message)
                waitingUsers.push(message.username)
                # I am not a big fan of this, not sure on how to solve this better tho (ChillyFlashER)
                setTimeout(allow, 2000)
            else
                socket.emit 'slow-down'

    socket.on 'tomatoOver', (data) ->
        console.log JSON.stringify(data)
        io.sockets.emit('otherTomatoOver', data)
<<<<<<< HEAD

    checkUsername = (nick) ->
        # TODO: don't count with this users
        while propertyOf(connectedUsers, 'nick', nick) != -1
            nick += '_'
        return nick

    # TODO:
    userinfo.nick = checkUsername(userinfo.nick)

    socket.emit 'myinfo', userinfo
    socket.broadcast.emit 'user_con', userinfo

    console.log 'user connected: ' + socket.id    
    connectedUsers.push(userinfo)

    socket.on 'disconnect', () ->
        socket.broadcast.emit 'user_dis', userinfo
        console.log 'user disconnected: ' + socket.id
        connectedUsers.splice(connectedUsers.indexOf(userinfo), 1);

    socket.on 'users', () ->
        socket.emit 'users', connectedUsers

    socket.on 'myinfo', () ->
        socket.emit 'myinfo', userinfo

    socket.on 'setmyinfo', (info) ->
        if !!info.nick #and userinfo.nick != info.nick
            socket.broadcast.emit 'notice', userinfo.nick + ' changed name to ' + info.nick + '.'
            console.log '-------------------------------------------------------------------------------------------------------------------------'
            userinfo.nick = checkUsername(info.nick)
        socket.emit 'myinfo', userinfo
=======
>>>>>>> master
