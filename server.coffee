http = require('http')
path = require('path')
express = require('express')
Encoder = require('node-html-encoder').Encoder

#colors = require('colors');

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

# Less logging
io.set('log level', 1);

messageHistory = []
connectedUsers = []

# TODO: Remove this
waitingUsers = []

ensureMessageIsShort = (message, size) ->
    if message.length > size
        return message[...size]
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
        message.body = ensureMessageIsShort(message.body, 255)
        message.body = escapeHTML(message.body)
        message.timestamp = new Date()
        message.userid = userinfo.userid
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

        # TODO: Assign nick

        # TODO: conflict with itself        
        #for user in connectedUsers
        #    if user.userid == not info.userid and user.nick == info.nick
        #        info.nick += '_'
        
        #if info.nick.length > NickMaxLength then
        #    info.nick = ensureMessageIsShort(info.nick, NickMaxLength)

        return info.nick


    ###
            Connection
    ###

    connectedUsers.push(userinfo)
    socket.on 'disconnect', () ->
        socket.broadcast.emit 'user_dis', userinfo
        connectedUsers.splice(connectedUsers.indexOf(userinfo), 1);
#        console.log '[USER] '.green + "'#{userinfo.nick.underline.cyan}' (#{socket.id}) Disconnected"

    socket.on 'users', () ->
        socket.emit 'users', connectedUsers


    ###
            Client Info
    ###

    socket.on 'myinfo', ->
        socket.emit 'myinfo', userinfo

    socket.on 'setmyinfo', (info) ->
        oldNick = userinfo.nick
        newNick = checkNick(info)

        if oldNick != newNick
            userinfo.nick = newNick
            socket.broadcast.emit 'notice', '<b>' + oldNick + '</b> changed name to <b>' + userinfo.nick + '</b>.'

#            console.log '[INFO] '.green + "'#{oldNick.underline.cyan}' change nick to '#{newNick.underline.cyan}' (#{userinfo.userid})"
            socket.emit 'myinfo', userinfo

    socket.on 'identify', (info) ->
#        console.log 'IDENTIFY '.green + JSON.stringify(info)
        userinfo.nick = checkNick(info)
        userinfo.userColor = info.userColor
        socket.emit 'myinfo', userinfo
#        console.log '[USER] '.green + "'#{userinfo.nick.underline.cyan}' (#{socket.id}) Connected"

    socket.emit 'identify', {}
    
    socket.broadcast.emit 'user_con', userinfo
    
    socket.emit('welcome', { status: 'connected', messages: messageHistory })
