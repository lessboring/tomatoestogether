import {observable, computed, action} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import HeaderBar from './components/HeaderBar';
import Iframe from './components/Iframe';
import Empty from './components/Empty';
import Modal from './components/Modal';
import Store from './store';


@observer
export default class App extends React.Component<{store: Store}, {}> {
    render() {
        const {store} = this.props;
        return (
			<div>
                <HeaderBar />
                <p>Iframe window</p>
                <p>Tomato timer</p>
                

                <p>Login Modal</p>
                <p>Sign up modal</p>
                <p>Upgrade to full version modal</p>
                <p>Profile modal</p>

                <Modal
                    title="Login"
                    show={store.currentModal === 'login'}
                    handleClose={() => store.currentModal = null}
                >
                    <h3>Login</h3>
                </Modal>

                <Modal
                    title="Create Account"
                    show={store.currentModal === 'createAccount'}
                    handleClose={() => store.currentModal = null}
                >
                    <h3>Create Account</h3>
                </Modal>

                <Modal
                    title="Upgrade"
                    show={store.currentModal === 'upgrade'}
                    handleClose={() => store.currentModal = null}
                >
                    <h3>Upgrade</h3>
                </Modal>

                <Modal
                    title="Your Profile"
                    show={store.currentModal === 'profile'}
                    handleClose={() => store.currentModal = null}
                >
                    <h3>Your Profile</h3>
                </Modal>
            </div>
		);
	}
}
