import { MockableHttp } from './mockable-http';
import { browserHistory } from 'react-router';

const http = new MockableHttp('http://tomatoestogether/app/api/v1');
if (typeof window !== 'undefined') {
    (window as any).http = http;
}
http.catchAll = (err: any) => {
    const current = browserHistory.location.pathname;
    if (current !== '/login' && err.response.status === 401) {
        // If the token is still here, it must be out of date
        localStorage.removeItem('token');
        browserHistory.push('/login');
    }
    else if (err.response.status === 404) {
        browserHistory.push('/404');
    }
    else {
        throw err;
    }
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
