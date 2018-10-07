export const newTomato = (initial = {}) => ({
    project: initial.project || null,
    completedTasks: [],
    currentTask: initial.currentTask || '',
    duration: initial.duration || null,
    start: null,
});

export const newBreak = () => ({
    task: '',
    start: +new Date(),
});

export const isValidTomato = (tomato) => {
    return (
        typeof tomato === 'object' &&
        typeof tomato.project !== 'undefined' &&
        typeof tomato.completedTasks !== 'undefined' &&
        typeof tomato.currentTask !== 'undefined' &&
        typeof tomato.duration !== 'undefined' &&
        typeof tomato.start !== 'undefined'
    );
};

export const isValidBreak = (break_) => {
    return break_ === null || (
        typeof break_ === 'object' &&

        typeof break_ === 'object' &&
        typeof break_.task !== 'undefined' &&
        typeof break_.start !== 'undefined'
    );
};

export const loadState = () => {
    try {
        const stateData = localStorage.getItem('state');
        if (stateData) {
            const {
                currentTomato,
                currentBreak,
            } = JSON.parse(stateData);
            if (isValidTomato(currentTomato) && isValidBreak(currentBreak)) {
                return { currentTomato, currentBreak };
            }
            localStorage.removeItem('state');
        }
    } catch (_) {
        localStorage.removeItem('state');
    }
    return null;
};

export const saveState = (currentTomato, currentBreak) => {
    localStorage.setItem('state', JSON.stringify({
        currentTomato,
        currentBreak,
    }));
};
