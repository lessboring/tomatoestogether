var util = require('util');

var gongSound = new Audio('gong.mp3')

function ringGong() {
    gongSound.play();
}

function scrollChatToBottom() {
    $('.chat-container').stop().animate({
        scrollTop: $('.chat-container')[0].scrollHeight
    }, 800);
}
    
ko.bindingHandlers.checkbox = {
    init: function(element, valueAccessor, allBindings, data, context) {
        var observable = valueAccessor();

        if (!ko.isWriteableObservable(observable)) {
            throw('You must pass an observable or writeable computed');
        }

        var $element = $(element);

        $element.on('click', function() {
            observable(!observable());
            return;
        });

        ko.computed({
            disposeWhenNodeIsRemoved: element,
            read: function() {
                $element.toggleClass('active', observable());
                return;
            }
        });

        return;
    }
};

function getDate() {
    date = new Date();
    // If you want it to always be break mode, uncomment this line, TODO make an easier way to do this
    // date.setMinutes(date.getMinutes() % 5 + 25);
    return date;
}

var emotes = {
    'Kappa': 'kappa',
    'Colgan': 'colgan',
    'NGCCG': 'ngccg',
    ':O': 'shocked',
    'FrankerZ': 'frankerz',
    'YOLOSwag': 'swag',
    'JordanFitz': 'jordanfitz',
    'BeExcellent': 'lincoln',
    'Grrrr': 'brooding',
    'BigBrother': 'bigbrother',
    'Tinfoilboy': 'tinfoilboy',
    'FrankerQ': 'fitzdog',
    'NoHair': 'nohair',
    'OneTomato': 'tomato',
    'Dooskington': 'dooskington'
};

$(document).ready(function() {
    $('body').tooltip({
        selector: '[rel=tooltip]'
    });

    var ViewModel = function() {
        var socket = io.connect(window.location.origin);
        var vm = this;

        vm.connected = ko.observable(false);
        vm.clock = ko.observable(getDate());
        vm.state = ko.observable(null);
        vm.chatMessages = ko.observableArray([]);
        vm.newChatMessage = ko.observable('');
        vm.doneTomatoes = ko.observableArray([]);
        vm.nextTomatoTask = ko.observable('');
        vm.nextTomatoTaskInput = ko.observable('');

        vm.pastTomatoes = {};

        vm.connectedUsers = ko.observable({});

        // Template
        vm.clockHeaderMessage = ko.computed(function() {
            return vm.state() === 'tomato' ? 'Tomato Time!' : 'Break Time!';
        });
        
        vm.clockBreakTime = ko.computed(function() {
            return vm.state() === 'break' ? 'clock break' : 'clock work';
        });
        
        vm.clockInnerHTML = ko.computed(function() {
            return vm.state() === 'break' ? '<p>Tell everyone about what you did in the chat until the break timer reaches zero!</p>' : '<h3>You have not joined this tomato.</h3>';
        });
        
        vm.clockInnerText = ko.computed(function() {
            return vm.state() === 'break' ? 'Next tomato\'s task:' : 'Work without distractions until the work timer reaches zero on:';
        });

        vm.messageTemplateToUse = function(item) {
            return item.template === 'Server' ? 'serverMessage' : 'defaultMessage'
        };
        
        // Debug Stuff
        vm.debugChatEnable = ko.observable(false);
        vm.debugServerMessages = ko.observable(false);

        // This is also used in templates
        vm.chatEnabled = function() {
            if (vm.debugChatEnable()) {
                return true;
            }
            return vm.connected() && vm.state() === 'break'
        };

        // Storage
        vm.nick = ko.observable('guest');
        vm.userColor = ko.observable('#000000');
        vm.playSound = ko.observable(true);

        vm.restoreFromLocalStorage = function() {
            var saved = localStorage.getItem('tomatoestogether');
            if (saved !== null) {
                saved = JSON.parse(saved);
                vm.nick(saved.nick || 'guest');
                vm.userColor(saved.userColor || '#000000');
                vm.doneTomatoes(saved.doneTomatoes || []);
                if (saved.playSound !== null) {
                    vm.playSound(saved.playSound);
                }
            }

            // This has to be done after the values are read
            // or they will be overwritten, which is why it is inside restoreFromLocalStorage
            vm.saveToLocalStorage = ko.computed(function() {
                // console.log 'Saving to localStorage.'
                var saved = {
                    nick: vm.nick(),
                    userColor: vm.userColor(),
                    playSound: vm.playSound(),
                    doneTomatoes: vm.doneTomatoes()
                };
                localStorage.setItem('tomatoestogether', JSON.stringify(saved));
            });
        };

        // Tomato
        vm.joinNextTomato = function() {
            vm.nextTomatoTask(vm.nextTomatoTaskInput());
            vm.nextTomatoTaskInput('');
        };

        vm.finishTomato = function() {
            if (vm.nextTomatoTask() !== '') {
                vm.doneTomatoes.push({
                    task: vm.nextTomatoTask(),
                    day: getDate().toDateString()
                });
                // TODO: This should be done differently 
                socket.emit('message', {
                    nick: vm.nick(),
                    body: "My tomato task: " + vm.nextTomatoTask(),
                    userColor: vm.userColor()
                });

                vm.nextTomatoTask('');
            }
        };

        // Clock time
        vm.tick = function() {
            vm.clock(getDate());
        };

        vm.formattedClock = ko.computed(function() {
            return util.formatCurrentTime(vm.clock());
        });

        vm.formattedTime = ko.computed(function() {
            result = util.tomatoTimeFromHourTime(vm.clock());
            var minutesLeft = result[0],
                secondsLeft = result[1],
                state       = result[2];
            if (vm.state() !== null && vm.state() !== state) {
                if (vm.playSound()) {
                    ringGong();
                }
                if (state === 'break') {
                    // Finish the current tomato if there is one
                    vm.finishTomato();
                }
            }
            vm.state(state);
            return util.formatTomatoClock(minutesLeft, secondsLeft);
        });

        vm.connectedUserList = ko.computed(function() {
            var connectedUsers = vm.connectedUsers();
            users = [];
            for (nick in connectedUsers) {
                var user = connectedUsers[nick];
                users.push(user)
            }
            return users;
        });

        // Completed Tomatoes
        vm.todaysTomatoes = ko.computed(function() {
            var todays = [];
            var today = getDate().toDateString();
            var doneTomatoes = vm.doneTomatoes()
            for (var i=0; i<doneTomatoes.length; i++) {
                var tomato = doneTomatoes[i];
                if (tomato.day === today) {
                    todays.push(tomato);
                }
            }
            return todays;
        });

        // Emotes
        var emoteSrc = function(emoteFile) {
            return '<img src="emotes/' + emoteFile + '.png"/>';
        };

        // Messages
        vm.sendMessage = function(form) {
            socket.emit('message', {
                nick: vm.nick(),
                body: vm.newChatMessage(),
                userColor: vm.userColor()
            });
            vm.newChatMessage('');
        };

        vm.addMessage = function(message) {
            for (emoteKeyword in emotes) {
                var emoteFile = emotes[emoteKeyword];
                message.body = message.body.replace('/' + emoteKeyword + '/g', emoteSrc(emoteFile));
            }

            message.body = Autolinker.link(message.body, { stripPrefix: false });
            message.timestamp = new Date(message.timestamp);

            if (message.body.trim().length !== 0) {
                vm.chatMessages.push(message);
                scrollChatToBottom();
            }
        }

        vm.addServerMessage = function(text) {
            if (vm.debugServerMessages()) {
                vm.addMessage({template: 'Server', nick: 'server', timestamp: new Date(), body: text});
            }
        }

        // Initial connection message
        socket.on('welcome', function(data) {
            vm.connected(true);
            for (var i=0; i<data.messages.length; i++) {
                vm.addMessage(data.messages[i]);
            }
        });

        // New message
        socket.on('message', function(message) {
            vm.addMessage(message);
        });

        // TODO: Never send message to the server
        socket.on('slow-down', function() {
            vm.addServerMessage("You're sending messages too quickly.");
        });

        // Users
        vm.getUsers = function() {
            socket.emit('users');
        };

        socket.on('users', function(users) {
            console.log(users);
            connectedUsers = vm.connectedUsers();
            for (var i=0; i<users.length; i++) {
                var user = users[i];
                connectedUsers[user.nick] = user;
            }
            vm.connectedUsers(connectedUsers);
        });


        // Client Info
        vm.updateMyInfo = function() {
            socket.emit('setmyinfo', { nick: vm.nick() });
        };

        socket.on('myinfo', function(info) {
            if (vm.nick() !== info.nick) {
                vm.nick(info.nick);
            }
        });

        vm.setMyInfo = function(userinfo) {
            socket.emit('setmyinfo', userinfo);
        };

        // Server Messages
        socket.on('user_con', function(info) {
            vm.addServerMessage('<b>' + info.nick + '</b> connected.');
            connectedUsers = vm.connectedUsers();
            connectedUsers[info.nick] = info;
            vm.connectedUsers(connectedUsers);
        });

        socket.on('user_dis', function(info) {
            vm.addServerMessage('<b>' + info.nick + '</b> disconnected.');
            connectedUsers = vm.connectedUsers();
            delete connectedUsers[info.nick];
            vm.connectedUsers(connectedUsers);
        });

        // Message from server
        socket.on('notice', function(message) {
            vm.addServerMessage(message);
        });

        vm.getUsers();

        // Initiate Server Connection
        vm.restoreFromLocalStorage();

        socket.on('identify', function() {
            socket.emit('identify', {nick: vm.nick(), userColor: vm.userColor()});
        });

        // Set the clock update timer
        setInterval(vm.tick, 1000);

        // Make the view model available in the console
        window.vm = vm;
    };

    ko.applyBindings(new ViewModel);

});
