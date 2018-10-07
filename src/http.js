import axios from 'axios';
import qs from 'qs';
import { getCookie } from './util';

export const postForm = (url, data) => {
    return axios.post(url, qs.stringify(data), {
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
    });
};
