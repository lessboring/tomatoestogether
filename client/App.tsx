import {observable, computed, action} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import HeaderBar from './components/HeaderBar';
import Iframe from './components/Iframe';
import Empty from './components/Empty';
import Modal from './components/Modal';
import Upgrade from './components/Upgrade';
import Login from './components/Login';
import Spinner from './components/Spinner';
import TomatoTimer from './components/TomatoTimer';
import Tasks from './components/Tasks';
import {store} from './store';


@observer
export default class App extends React.Component<{}, {}> {
    render() {
        return (store.loading && <Spinner /> || (
			<div>
                <HeaderBar />
                <TomatoTimer />
                {store.isTomato ? (
                    <Tasks />
                ) : (
                    <Iframe src="https://www.twitch.tv/dvcolgan/chat?popout=" />
                )}


                <Modal
                    title="Log in to Tomatoes Together"
                    show={store.currentModal === 'login'}
                    handleClose={store.closeModal}
                >
                    <Login />
                </Modal>

                <Modal
                    title="Upgrade to Tomatoes Together Pro"
                    show={store.currentModal === 'upgrade'}
                    handleClose={store.closeModal}
                >
                    <Upgrade />
                </Modal>

                <Modal
                    title="Settings"
                    show={store.currentModal === 'settings'}
                    handleClose={store.closeModal}
                >
                    <h3>Your Profile</h3>
                </Modal>
            </div>
		));
	}
}
