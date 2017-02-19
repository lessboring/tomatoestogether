import {observable, computed, action} from 'mobx';
import {observer, inject} from 'mobx-react';
import * as React from 'react';
import HeaderBar from './components/HeaderBar';
import Iframe from './components/Iframe';


const store = observable({
    showModal: true,
    showLogin: true,
    showCreateAccount: false,
    showUpgrade: false,
    showProfile: false,
});


@observer
class Modal extends React.Component<{show: boolean, children?: any}, {}> {
    render() {
        return (
            <div className="modal fade show" style={{display: this.props.show ? 'block' : 'none'}}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">{this.props.title}</h3>
                            <button type="button" className="close" onClick={(e) => store.showModal = false}>
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

@observer
export default class App extends React.Component<{}, {}> {
    render() {
        return (
			<div>
                <HeaderBar />
                <p>Iframe window</p>
                <p>Tomato timer</p>
                
                <Modal show={store.showModal}>
                    {store.showLogin && (
                        <h3>Login</h3>
                    ) || store.showCreateAccount && (
                        <h3>CreateAccount</h3>
                    ) || store.showUpgrade && (
                        <h3>Upgrade</h3>
                    ) || store.showProfile && (
                        <h3>Profile</h3>
                    ) || (
                        <div />
                    )}
                </Modal>

                <p>Login Modal</p>
                <p>Sign up modal</p>
                <p>Upgrade to full version modal</p>
                <p>Profile modal</p>
                {store.showModal && (
                    <div className="modal-backdrop show fade"></div>
                )}
            </div>
		);
	}
}
