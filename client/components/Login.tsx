import * as React from 'react';
import { browserHistory } from 'react-router';
import {observer, inject} from 'mobx-react';
import FormField from './FormField';
import {observable, computed, action} from 'mobx';
import Spinner from './Spinner';
import {Store, LoginStore} from '../stores';

@inject('store', 'loginStore')
@observer
export default class Login extends React.Component<{
    store?: Store,
    loginStore?: LoginStore,
}, {}> {
    render() {
        const loginStore = this.props.loginStore!;
        return loginStore.loading && <Spinner /> || (
            <form method="POST" onSubmit={loginStore.submit}>
                <FormField
                    type="text"
                    name="email"
                    value={loginStore.form.email}
                    onChange={(e: any) => loginStore.form.email = e.target.value}
                />
                <FormField
                    type="password"
                    name="password"
                    value={loginStore.form.password}
                    onChange={(e: any) => loginStore.form.password = e.target.value}
                />
                <input type="submit" className="btn btn-primary" id="submit" value="Log In" />
            </form>
        );
    }
}
