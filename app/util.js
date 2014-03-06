function padWithZero(num) {
    if (num.toString().length === 1) {
        return '0' + num.toString();
    }
    else {
        return num.toString();
    }
}

module.exports = {
    tomatoTimeFromHourTime: function(currentTime) {
        var minutes = currentTime.getMinutes();
        var seconds = currentTime.getSeconds();
        var minutesLeft = 0;
        var state = null;

        if (minutes >= 55) {
            minutesLeft = 5 - (minutes - 55) - 1;
            state = 'break';
        }
        else if (minutes >= 30) {
            minutesLeft = 25 - (minutes - 30) - 1;
            state = 'tomato';
        }
        else if (minutes >= 25) {
            minutesLeft = 5 - (minutes - 25) - 1;
            state = 'break';
        }
        else {
            minutesLeft = 25 - minutes - 1;
            state = 'tomato';
        }
        var secondsLeft = 60 - seconds - 1;
        return [minutesLeft, secondsLeft, state];
    },

    formatCurrentTime: function(date) {
        hours = date.getHours();
        minutes = date.getMinutes();
        seconds = date.getSeconds();
        return hours + ':' + padWithZero(minutes) + ':' + padWithZero(seconds);
    },

    formatTomatoClock: function(minutesLeft, secondsLeft) {
        return minutesLeft + ':' + padWithZero(secondsLeft);
    }
};
