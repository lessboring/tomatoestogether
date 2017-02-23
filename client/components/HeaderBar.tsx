import * as React from 'react';
import {observer} from 'mobx-react';
import {store} from '../store';


export default observer(function HeaderBar() {
    return (
        <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
            <button className="navbar-toggler navbar-toggler-right" type="button" onClick={() => store.toggleMenu()}>
                <span className="navbar-toggler-icon"></span>
            </button>
            <a className="navbar-brand" href="#" onClick={() => store.closeModal()}>
                <img className="tomato-logo" src="/assets/tomato.png"/>
                Tomatoes Together
            </a>

            <div className={'collapse navbar-collapse ' + (store.menuExpanded ? 'show' : '')}>
                <div className="navbar-nav">
                    <a className="nav-item nav-link" href="#" onClick={() => store.openModal('settings')}>Settings</a>
                    <a className="nav-item nav-link" href="#" onClick={() => store.openModal('upgrade')}>Upgrade to Pro</a>
                    <a className="nav-item nav-link" href="#" onClick={() => store.openModal('login')}>Log In</a>
                    <a className="nav-item nav-link" href="#" onClick={() => store.logOut()}>Log Out</a>
                </div>
            </div>
        </nav>
    );
});
