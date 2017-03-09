export const padWithZero = (num: number) => {
    if (num.toString().length === 1) {
        return '0' + num.toString();
    }
    else {
        return num.toString();
    }
};

export const tomatoTimeFromHourTime = (currentTime: Date): [number, number, TomatoState] => {
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    let minutesLeft = 0;
    let state: TomatoState = 'break';

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
    const secondsLeft = 60 - seconds - 1;
    return [minutesLeft, secondsLeft, state];
};

export const formatCurrentTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${hours}:${padWithZero(minutes)}:${padWithZero(seconds)}`;
};

export const formatTomatoClock = (minutesLeft: number, secondsLeft: number) => {
    return `${minutesLeft}:${padWithZero(secondsLeft)}`;
};

export function times<T>(amount: number, callback: (i: number) => T): T[] {
    const res: T[] = [];
    for (let i=0; i<amount; i++) {
        res.push(callback(i));
    }
    return res
};
