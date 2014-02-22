(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("main", function(exports, require, module) {
var emotes, getDate, gongSound, ringGong, scrollChatToBottom, util;

util = require('util');


(function() {
  var autoLink,
    __slice = [].slice;

  autoLink = function() {
    var k, linkAttributes, option, options, pattern, v;
    options = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    pattern = /(^|\s)((?:https?|ftp):\/\/[\-A-Z0-9+\u0026@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi;
    if (!(options.length > 0)) {
      return this.replace(pattern, "$1<a target='_blank' href='$2'>$2</a>");
    }
    option = options[0];
    linkAttributes = ((function() {
      var _results;
      _results = [];
      for (k in option) {
        v = option[k];
        if (k !== 'callback') {
          _results.push(" " + k + "='" + v + "'");
        }
      }
      return _results;
    })()).join('');
    return this.replace(pattern, function(match, space, url) {
      var link;
      link = (typeof option.callback === "function" ? option.callback(url) : void 0) || ("<a target='_blank' href='" + url + "'" + linkAttributes + ">" + url + "</a>");
      return "" + space + link;
    });
  };

  String.prototype['autoLink'] = autoLink;

}).call(this);
;

String.prototype.replaceAll = function(search, replace) {
  if (replace == null) {
    return this.toString();
  }
  return this.split(search).join(replace);
};

gongSound = new Audio('gong.mp3');

ringGong = function() {
  return gongSound.play();
};

scrollChatToBottom = function() {
  return $('.chat-container').stop().animate({
    scrollTop: $('.chat-container')[0].scrollHeight
  }, 800);
};

ko.bindingHandlers.checkbox = {
  init: function(element, valueAccessor, allBindings, data, context) {
    var $element, observable;
    observable = valueAccessor();
    if (!ko.isWriteableObservable(observable)) {
      throw "You must pass an observable or writeable computed";
    }
    $element = $(element);
    $element.on("click", function() {
      observable(!observable());
    });
    ko.computed({
      disposeWhenNodeIsRemoved: element,
      read: function() {
        $element.toggleClass("active", observable());
      }
    });
  }
};

getDate = function() {
  var date;
  date = new Date();
  return date;
};

emotes = {
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
  'OneTomato': 'tomato'
};

$(function() {
  var ViewModel;
  $('body').tooltip({
    selector: '[rel=tooltip]'
  });
  ViewModel = function() {
    var emoteSrc, socket, vm;
    socket = io.connect(window.location.origin);
    vm = this;
    vm.connected = ko.observable(false);
    vm.clock = ko.observable(getDate());
    vm.state = ko.observable(null);
    vm.chatMessages = ko.observableArray([]);
    vm.newChatMessage = ko.observable('');
    vm.doneTomatoes = ko.observableArray([]);
    vm.nextTomatoTask = ko.observable('');
    vm.nextTomatoTaskInput = ko.observable('');
    vm.pastTomatoes = {};
    vm.clockHeaderMessage = ko.computed(function() {
      if (vm.state === 'tomato') {
        return 'Tomato Time!';
      }
      if (vm.state === 'observing') {
        return 'Tomato Time!';
      }
      if (vm.state === 'tomato') {
        return 'Tomato Time!';
      }
    });
    vm.username = ko.observable('guest');
    vm.userColor = ko.observable('#000000');
    vm.playSound = ko.observable(true);
    vm.joinNextTomato = function() {
      vm.nextTomatoTask(vm.nextTomatoTaskInput());
      return vm.nextTomatoTaskInput('');
    };
    vm.finishTomato = function() {
      if (vm.nextTomatoTask() !== '') {
        vm.doneTomatoes.push({
          task: vm.nextTomatoTask(),
          day: getDate().toDateString()
        });
        socket.emit('message', {
          username: vm.username(),
          body: "My tomato task: " + vm.nextTomatoTask(),
          userColor: vm.userColor()
        });
        return vm.nextTomatoTask('');
      }
    };
    vm.restoreFromLocalStorage = function() {
      var saved;
      saved = localStorage.getItem('tomatoestogether');
      if (saved != null) {
        console.log('Reading from localStorage' + saved);
        saved = JSON.parse(saved);
        vm.username(saved.username || 'guest');
        vm.userColor(saved.userColor || '#000000');
        vm.doneTomatoes(saved.doneTomatoes || []);
        if (saved.playSound != null) {
          vm.playSound(saved.playSound);
        }
      }
      return vm.saveToLocalStorage = ko.computed(function() {
        console.log('Saving to localStorage.');
        saved = {
          username: vm.username(),
          userColor: vm.userColor(),
          playSound: vm.playSound(),
          doneTomatoes: vm.doneTomatoes()
        };
        console.log(saved);
        return localStorage.setItem('tomatoestogether', JSON.stringify(saved));
      });
    };
    vm.tick = function() {
      return vm.clock(getDate());
    };
    vm.formattedClock = ko.computed(function() {
      return util.formatCurrentTime(vm.clock());
    });
    vm.todaysTomatoes = ko.computed(function() {
      var today, todays, tomato, _i, _len, _ref;
      todays = [];
      today = getDate().toDateString();
      _ref = vm.doneTomatoes();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tomato = _ref[_i];
        if (tomato.day === today) {
          todays.push(tomato);
        }
      }
      return todays;
    });
    vm.formattedTime = ko.computed(function() {
      var minutesLeft, secondsLeft, state, _ref;
      _ref = util.tomatoTimeFromHourTime(vm.clock()), minutesLeft = _ref[0], secondsLeft = _ref[1], state = _ref[2];
      if ((vm.state() != null) && vm.state() !== state) {
        if (vm.playSound()) {
          ringGong();
        }
        if (state === 'break') {
          vm.finishTomato();
        }
      }
      vm.state(state);
      return util.formatTomatoClock(minutesLeft, secondsLeft);
    });
    vm.sendMessage = function(form) {
      socket.emit('message', {
        username: vm.username(),
        body: vm.newChatMessage(),
        userColor: vm.userColor()
      });
      return vm.newChatMessage('');
    };
    emoteSrc = function(emoteFile) {
      return '<img src="emotes/' + emoteFile + '.png"/>';
    };
    vm.addMessage = function(message) {
      var emoteFile, emoteKeyword;
      for (emoteKeyword in emotes) {
        emoteFile = emotes[emoteKeyword];
        message.body = message.body.replaceAll(emoteKeyword, emoteSrc(emoteFile));
      }
      debugger;
      message.body = Autolinker.link(message.body, {
        stripPrefix: false
      });
      vm.chatMessages.push(message);
      return scrollChatToBottom();
    };
    setInterval(vm.tick, 1000);
    socket.on('hello', function(data) {
      var message, _i, _len, _ref, _results;
      vm.connected(true);
      _ref = data.messages;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        message = _ref[_i];
        _results.push(vm.addMessage(message));
      }
      return _results;
    });
    socket.on('message', function(message) {
      return vm.addMessage(message);
    });
    vm.restoreFromLocalStorage();
    window.vm = vm;
    return null;
  };
  return ko.applyBindings(new ViewModel);
});
});

;require.register("storage", function(exports, require, module) {
module.exports = {
  saveCompletedTomato: function(tomato) {
    var storage;
    storage = JSON.parse(localStorage.getItem('tomatoestogether'));
    if (storage.tomatoes == null) {
      storage.tomatoes = [];
    }
    storage.tomatoes.append(tomato);
    return localStorage.setItem(JSON.stringify(storage));
  }
};
});

;require.register("util", function(exports, require, module) {
var padWithZero;

padWithZero = function(num) {
  if (num.toString().length === 1) {
    return '0' + num.toString();
  } else {
    return num.toString();
  }
};

module.exports = {
  tomatoTimeFromHourTime: function(currentTime) {
    var minutes, minutesLeft, seconds, secondsLeft, state;
    minutes = currentTime.getMinutes();
    seconds = currentTime.getSeconds();
    minutesLeft = 0;
    state = null;
    if (minutes >= 55) {
      minutesLeft = 5 - (minutes - 55) - 1;
      state = 'break';
    } else if (minutes >= 30) {
      minutesLeft = 25 - (minutes - 30) - 1;
      state = 'tomato';
    } else if (minutes >= 25) {
      minutesLeft = 5 - (minutes - 25) - 1;
      state = 'break';
    } else {
      minutesLeft = 25 - minutes - 1;
      state = 'tomato';
    }
    secondsLeft = 60 - seconds - 1;
    return [minutesLeft, secondsLeft, state];
  },
  formatCurrentTime: function(date) {
    var hours, minutes, seconds;
    hours = date.getHours();
    minutes = date.getMinutes();
    seconds = date.getSeconds();
    return hours + ':' + padWithZero(minutes) + ':' + padWithZero(seconds);
  },
  formatTomatoClock: function(minutesLeft, secondsLeft) {
    return minutesLeft + ':' + padWithZero(secondsLeft);
  }
};
});

;
//# sourceMappingURL=app.js.map