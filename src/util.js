export const getCookie = (name) => {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=');
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    } else {
        return '';
    }
};

export const getDjangoJSON = (id) => {
    return JSON.parse(
        document.getElementById(id).textContent,
    );
};

export const setHTML = (id, html) => {
    document.getElementById(id).innerHTML = html;
};

export const timeToDjango = (timestamp) => {
    const date = new Date();
    date.setTime(timestamp);
    const matches = date.toISOString().match(
        /(\d\d\d\d-\d\d-\d\d)T(\d\d:\d\d:\d\d)/,
    );
    return `${matches[1]} ${matches[2]}`;
};

export const durationToDjango = (timestamp) => {
    return timestamp / 1000;
};

window.getCookie = getCookie;
window.getDjangoJSON = getDjangoJSON;
window.setHTML = setHTML;
