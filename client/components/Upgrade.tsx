import * as React from 'react';
import {observer} from 'mobx-react';
import FormField from './FormField';
import {observable, computed, action} from 'mobx';
import Spinner from './Spinner';
import http from '../http';
import {store} from '../store';
import {User} from '../models';


export class UpgradeStore {
    @observable credentials = {
        email: '',
        name: '',
        password: '',
        password2: '',
    };
    @observable loading: boolean = false;
    @observable error: {
        email?: string[],
        name?: string[],
        password?: string[],
        password2?: string[],
    } = {};

    @action submit = (e: React.SyntheticEvent<{}>) => {
        e.preventDefault();
        this.loading = true;
        http.post('/users/', {
            email: this.credentials.email,
            name: this.credentials.name,
            password: this.credentials.password,
        })
        .then(action((userData) => {
            store.user = new User(userData);
            http.post('/auth/token/', {
                email: this.credentials.email,
                password: this.credentials.password,
            })
            .then(action((response: {token: string}) => {
                localStorage.setItem('token', response.token);
                this.loading = false;
                store.closeModal();
                store.openModal('settings');
            }));
        }))
        .catch(action((error) => {
            this.error = error;
            this.loading = false;
        }));
    }
}

const upgradeStore: UpgradeStore = new UpgradeStore();

export default observer(function Upgrade() {
    return upgradeStore.loading && <Spinner /> || (
        <form method="POST" onSubmit={upgradeStore.submit}>
            <FormField
                type="text"
                name="email"
                value={upgradeStore.credentials.email}
                onChange={(e: any) => upgradeStore.credentials.email = e.target.value}
                errors={upgradeStore.error.email}
            />
            <FormField
                type="text"
                name="name"
                value={upgradeStore.credentials.name}
                onChange={(e: any) => upgradeStore.credentials.name = e.target.value}
                errors={upgradeStore.error.name}
            />
            <FormField
                type="password"
                name="password"
                value={upgradeStore.credentials.password}
                onChange={(e: any) => upgradeStore.credentials.password = e.target.value}
                errors={upgradeStore.error.password}
            />
            <FormField
                type="password"
                name="confirm-password"
                value={upgradeStore.credentials.password2}
                onChange={(e: any) => upgradeStore.credentials.password2 = e.target.value}
                errors={upgradeStore.error.password2}
            />
            <input type="submit" className="btn btn-primary" id="submit" value="Log In" />
        </form>
    );
});
