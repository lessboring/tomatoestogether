import * as React from 'react';
import {Link} from 'react-router';
import * as DocumentTitle from 'react-document-title';
import {observer, inject} from 'mobx-react';
import {CardLayout} from '../components/Layouts';
import FormField from '../components/FormField';
import {IsNotEmpty} from "class-validator";
import PageError from '../components/PageError';
import {observable, computed, action} from 'mobx';
import {browserHistory} from 'react-router';
import http from '../http';


export class LoginStore {
    @observable credentials = {
        email: '',
        password: '',
    };
    @observable loading: boolean = false;
    @observable error: any = '';

    @action login() {
        this.loading = true;
        http.post('/users/login', {
            email: this.credentials.email,
            password: this.credentials.password,
        })
        .then((response) => {
            this.loading = false;
            localStorage.setItem('token', response.key);
            browserHistory.push('/home');
        })
        .catch((error) => {
            this.loading = false;
            this.error = error.response.data.modelState || {
                Error: {errors: [{errorMessage: "We couldn't find that email or password."}]}
            };
        });
    }

    constructor() {
    }
}

@observer
export default class Login extends React.Component<{}, {}> {
    store: LoginStore = new LoginStore();
    handleSubmit = (e: any) => {
        e.preventDefault();
        this.store.login()
    }

    handleChange = (name: keyof LoginCredentials) => (e: any) => {
        this.store.credentials[name] = (e.target as any).value;
    }

    render() {
        return (
            <DocumentTitle title="Log In | Tomatoes Together">
                <CardLayout cols="8">
                    <h1>Log In</h1>
                    <PageError error={this.store.error}>
                        {this.store.loading && <Spinner /> || (
                            <form method="POST" onSubmit={this.handleSubmit}>
                                <FormField
                                    type="text"
                                    name="email"
                                    value={this.store.credentials.email}
                                    onChange={this.handleChange('email')}
                                />
                                <FormField
                                    type="password"
                                    name="password"
                                    value={this.store.credentials.password}
                                    onChange={this.handleChange('password')}
                                />
                                <Link className="btn btn-link pull-xs-right" to="/register">Or Register</Link>
                                <input type="submit" className="btn btn-primary" id="submit" value="Log In" />
                                {
                                    //<Link className="btn btn-link" to="/forgot-password">Forgot your password?</Link>
                                }
                            </form>
                        )}
                    </PageError>
                </CardLayout>
            </DocumentTitle>
        );
    }
}
