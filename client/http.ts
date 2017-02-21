import { MockableHttp } from './mockable-http';
import { browserHistory } from 'react-router';
import {store} from './store';

const http = new MockableHttp('http://tomatoestogether/api/v1');
if (typeof window !== 'undefined') {
    (window as any).http = http;
}

http.catchAll = (err: any) => {
    if (store.currentModal !== 'login' && err.response.status === 401) {
        // If the token is still here, it must be out of date
        localStorage.removeItem('token');
        store.openModal('login');
    }
    throw err;
};


export default http;

/*
http.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('token');

    let headers: any = config.headers;

    if (token) {
        headers['Authorization'] = token;
    }

    return config;
});

http.interceptors.response.use(response => response, error => {
    if (error.status === 401 && error.data.error === 'token_expired') {
        localStorage.removeItem('token');
        alert('Token expired');
        browserHistory.push('/login');
    } else {
        document.body.innerHTML = error.data;
    }
    return error;
});

*/
