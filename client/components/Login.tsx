import * as React from 'react';
import {observer} from 'mobx-react';
import FormField from './FormField';
import {observable, computed, action} from 'mobx';
import Spinner from './Spinner';
import http from '../http';
import {store} from '../store';


export class LoginStore {
    @observable credentials = {
        email: '',
        password: '',
    };
    @observable loading: boolean = false;
    @observable error: {
        email?: string[],
        password?: string[],
    } = {};

    @action submit = (e: React.SyntheticEvent<{}>) => {
        e.preventDefault();
        this.loading = true;
        http.post('/auth/token/', {
            email: this.credentials.email,
            password: this.credentials.password,
        })
        .then(action((response: {token: string}) => {
            localStorage.setItem('token', response.token);
            this.loading = false;
            store.closeModal();
            store.openModal('settings');
        }))
        .catch(action((error) => {
            this.error = error;
            this.loading = false;
        }));
    }
}

const loginStore: LoginStore = new LoginStore();

export default observer(function Login() {
    return loginStore.loading && <Spinner /> || (
        <form method="POST" onSubmit={loginStore.submit}>
            <FormField
                type="text"
                name="email"
                value={loginStore.credentials.email}
                onChange={(e: any) => loginStore.credentials.email = e.target.value}
                errors={loginStore.error.email}
            />
            <FormField
                type="password"
                name="password"
                value={loginStore.credentials.password}
                onChange={(e: any) => loginStore.credentials.password = e.target.value}
                errors={loginStore.error.password}
            />
            <input type="submit" className="btn btn-primary" id="submit" value="Log In" />
        </form>
    );
});
