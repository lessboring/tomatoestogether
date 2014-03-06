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
NickMaxLength = 32


server = http.createServer(app)
io = require('socket.io').listen(server)
server.listen(app.get('port'))

messageHistory = []
connectedUsers = []

# TODO: Remove this
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

    ###
            Tomato
    ###

    socket.on 'tomatoOver', (data) ->
        #console.log JSON.stringify(data)
        io.sockets.emit('otherTomatoOver', data)

    ###
            Messages
    ###

    socket.on 'message', (message) ->
        message.body = ensureMessageIsShort(message.body)
        message.body = escapeHTML(message.body)
        message.timestamp = new Date()
        pushMessage(message)
        
        allow = () ->
            waitingUsers.splice waitingUsers.indexOf(message.nick), 1
            null

        # TODO: Make this client side?
        if waitingUsers.indexOf(message.nick) == -1
            if message.body.trim().length != 0
                io.sockets.emit('message', message)
                waitingUsers.push(message.nick)
                setTimeout(allow, 2000)
        else
            socket.emit 'slow-down'

    ### 
            Nick
    ###

    checkNick = (info) ->
        # TODO: conflict with itself
        for user in connectedUsers
            if user.userid == not info.userid and user.nick == info.nick
                info.nick += '_'
        #if info.nick.length > NickMaxLength then
        #    info.nick.slice(NickMaxLength, NickMaxLength - info.nick.length)
        return info.nick

    ###
            Connection
    ###

    connectedUsers.push(userinfo)
    #console.log 'user connected: ' + socket.id
    socket.on 'disconnect', () ->
        socket.broadcast.emit 'user_dis', userinfo
        #console.log 'user disconnected: ' + socket.id
        connectedUsers.splice(connectedUsers.indexOf(userinfo), 1);

    socket.on 'users', () ->
        socket.emit 'users', connectedUsers

    ###
            Client Info
    ###

    socket.on 'myinfo', () ->
        socket.emit 'myinfo', userinfo

    socket.on 'setmyinfo', (info) ->
        if !!info.nick
            oldNick = userinfo.nick
            userinfo.nick = checkNick(info)
            socket.broadcast.emit 'notice', '<b>' + oldNick + '</b> changed name to <b>' + userinfo.nick + '</b>.'
        socket.emit 'myinfo', userinfo

    ###
            
    ###

    # Lets ask the client what nick and color he wants
    userinfo.nick = checkNick(userinfo)
    socket.emit 'myinfo', userinfo

    socket.broadcast.emit 'user_con', userinfo

    socket.emit('welcome', { status: 'connected', messages: messageHistory })
