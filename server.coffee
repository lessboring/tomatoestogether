http = require('http')
path = require('path')
express = require('express')

app = new express()

app.set('port', process.env.PORT or 3000)
app.set('views', path.join(__dirname, '/templates'))
app.set('view engine', 'jade')
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
    res.render('index', { })


server = http.createServer(app)
io = require('socket.io').listen(server)
server.listen(app.get('port'))

messageHistory = []

io.sockets.on 'connection', (socket) ->
    console.log messageHistory
    socket.emit('hello', { status: 'connected', messages: messageHistory })

    socket.on 'message', (data) ->
        console.log JSON.stringify(data)
        messageHistory.push(data)
        socket.emit('message', data)

    socket.on 'tomatoOver', (data) ->
        console.log JSON.stringify(data)
        socket.emit('otherTomatoOver', data)
