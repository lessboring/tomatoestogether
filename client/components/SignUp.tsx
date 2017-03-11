import * as React from 'react';
import {observer, inject} from 'mobx-react';
import FormField from './FormField';
import {observable, computed, action} from 'mobx';
import Spinner from './Spinner';
import {Store} from '../stores';


@inject('store')
@observer
export default class SignUp extends React.Component<{store?: Store}, {}> {
    render() {
        const signUpStore = this.props.store!.signUpStore;

        return signUpStore.loading && <Spinner /> || (
            <form method="POST" onSubmit={signUpStore.submit}>
                <FormField
                    type="text"
                    name="email"
                    value={signUpStore.form.email}
                    onChange={(e: any) => signUpStore.form.email = e.target.value}
                />
                <FormField
                    type="password"
                    name="password"
                    value={signUpStore.form.password}
                    onChange={(e: any) => signUpStore.form.password = e.target.value}
                />
                <FormField
                    type="password"
                    name="confirm-password"
                    value={signUpStore.form.password2}
                    onChange={(e: any) => signUpStore.form.password2 = e.target.value}
                />
                <input type="submit" className="btn btn-primary" id="submit" value="Log In" />
            </form>
        );
    }
}
