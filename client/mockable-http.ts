import * as axios from 'axios';

export interface HttpResponse<T> {
    reqJson?: {[key: string]: any};
    code: number;
    json: T;
}

export class MockableHttp {
    http: Axios.AxiosInstance;
    replacements: {[key: string]: HttpResponse<any>[]} = {};
    catchAll: Function | null = null;
    GETCache: {[key: string]: {}} = {};

    constructor(baseUrl: string) {
        this.http = axios.create({});
        this.http.defaults.headers.common['Content-Type'] = 'application/json';
        this.http.defaults.headers.common['Accept'] = 'application/json';
        this.http.defaults.baseURL = baseUrl;
    }

    request(verb: 'HEAD'|'GET'|'POST'|'PUT'|'PATCH'|'DELETE', url: string, body?: {[key: string]: any}, headers?: {[key: string]: any}): any {
        const key = `${verb} ${url}`;
        const replacementSet = this.replacements[key];
        if (replacementSet) {
            for (const response of replacementSet) {
                let matches = true;
                if (body && response.reqJson) {
                    for (const reqKey in response.reqJson) {
                        const reqVal = response.reqJson[reqKey];
                        if (body[reqKey] !== reqVal) {
                            matches = false;
                            break;
                        }
                    }
                    if (matches) {
                        return Promise.resolve(response);
                    }
                }
            }
        }

        const config: {
            url: string,
            method: string,
            params?: {},
            data?: {},
            headers?: {},
        } = {method: verb, url, headers};
        if (verb === 'GET' || verb === 'HEAD') {
            config.params = body;
        }
        else {
            config.data = body;
        }
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers = {Authorization: `JWT ${token}`};
            }
        }
        const promise = new Promise((resolve, reject) => {
            return this.http.request(config).then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                // TODO this gets called for each promise in an all() call
                try {
                    this.catchAll && this.catchAll(err);
                }
                catch (err) {
                    reject(err.response.data);
                }
            });
        });
        return promise;
    }

    all(promises: any) {
        return axios.all(promises);
    }

    head(url: string, params?: {}): Promise<any> {
        return this.request('HEAD', url, params);
    }
    get(url: string, cacheCallback?: (response: any) => void): Promise<any> {
        if (cacheCallback) {
            const value = this.GETCache[url];
            if (value) {
                cacheCallback(value);
            }
        }
        return this.request('GET', url);
    }
    post(url: string, body?: {}, headers?: {}): Promise<any> {
        return this.request('POST', url, body, headers);
    }
    put(url: string, body?: {}): Promise<any> {
        return this.request('PUT', url, body);
    }
    patch(url: string, body?: {}): Promise<any> {
        return this.request('PATCH', url, body);
    }
    delete(url: string, body?: {}): Promise<any> {
        return this.request('DELETE', url, body);
    }

    replace(
        verb: 'HEAD'|'GET'|'POST'|'PUT'|'PATCH'|'DELETE',
        url: string,
        body: {},
        expectedStatus: number,
        expectedJSON: {}
    ) {
        const key = `${verb} ${url}`;
        let replacementSet = this.replacements[key];
        if (!replacementSet) {
            replacementSet = [];
            this.replacements[key] = replacementSet;
        }
        replacementSet.push({
            reqJson: body,
            code: expectedStatus,
            json: expectedJSON
        });
    }

    clearReplacements() {
        this.replacements = {};
    }
}
