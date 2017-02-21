import {observable, computed, action} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import HeaderBar from './components/HeaderBar';
import Iframe from './components/Iframe';
import Empty from './components/Empty';
import Modal from './components/Modal';
import {store} from './store';


@observer
export default class App extends React.Component<{}, {}> {
    render() {
        return (
			<div>
                <HeaderBar />

                <p>Tasks list</p>
                <p>Iframe window</p>
                <p>Tomato timer</p>

                <Modal
                    title="Login"
                    show={store.currentModal === 'login'}
                    handleClose={store.closeModal}
                >
                    <h3>Login</h3>
                </Modal>

                <Modal
                    title="Upgrade"
                    show={store.currentModal === 'upgrade'}
                    handleClose={store.closeModal}
                >
                    <h3>Upgrade</h3>
                </Modal>

                <Modal
                    title="Settings"
                    show={store.currentModal === 'settings'}
                    handleClose={store.closeModal}
                >
                    <h3>Your Profile</h3>
                </Modal>
            </div>
		);
	}
}
