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


server = http.createServer(app)
io = require('socket.io').listen(server)
server.listen(app.get('port'))

messageHistory = []
waitingUsers = []

ensureMessageIsShort = (message) ->
    if message.length > 255
        return message[...255]
    return message

encoder = new Encoder('entity')
escapeHTML = (message) ->
    return encoder.htmlEncode(message)


io.sockets.on 'connection', (socket) ->
    console.log messageHistory
    socket.emit('hello', { status: 'connected', messages: messageHistory })

    socket.on 'message', (message) ->
        message.body = ensureMessageIsShort(message.body)
        message.body = escapeHTML(message.body)
        message.timestamp = new Date()
        messageHistory.push(message)
        console.log message

        allow = () ->
            waitingUsers.splice waitingUsers.indexOf(message.username), 1
            null

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
