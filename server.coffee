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


MaxMessageHistory = 100


server = http.createServer(app)
io = require('socket.io').listen(server)
server.listen(app.get('port'))

messageHistory = []
connectedUsers = []
waitingUsers = []

ensureMessageIsShort = (message) ->
    if message.length > 255
        return message[...255]
    return message

encoder = new Encoder('entity')
escapeHTML = (message) ->
    return encoder.htmlEncode(message)

pushMessage = (message) ->
    messageHistory.push(message)
    messageHistory.splice(0, messageHistory.length - MaxMessageHistory)


io.sockets.on 'connection', (socket) ->

    userinfo = {}
    userinfo.userid = socket.id
    userinfo.nick = 'guest'
    userinfo.usercolor = '#000000'

    socket.emit('hello', { status: 'connected', messages: messageHistory })

    socket.on 'message', (message) ->
        message.body = ensureMessageIsShort(message.body)
        message.body = escapeHTML(message.body)
        # Why do you set a new date here?
        message.timestamp = new Date()
        pushMessage(message)
        
        console.log message

        allow = () ->
            waitingUsers.splice waitingUsers.indexOf(message.username), 1
            null

        # TODO: Make this client side?
        if waitingUsers.indexOf(message.username) == -1
            if message.body.trim().length != 0
                io.sockets.emit('message', message)
                waitingUsers.push(message.username)
                setTimeout(allow, 2000)
        else
            socket.emit 'slow-down'

    socket.on 'tomatoOver', (data) ->
        console.log JSON.stringify(data)
        io.sockets.emit('otherTomatoOver', data)

    checkUsername = (info) ->
        # TODO: conflict with itself
        for user in connectedUsers
            console.log info
            if user.userid == not info.userid and user.nick == info.nick
                info.nick += '_'
        return info.nick

    userinfo.nick = checkUsername(userinfo.nick)

    socket.emit 'myinfo', userinfo

    # Clean this up?
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
        if !!info.nick
            socket.broadcast.emit 'notice', userinfo.nick + ' changed name to ' + info.nick + '.'
            userinfo.nick = checkUsername(info)
        socket.emit 'myinfo', userinfo
