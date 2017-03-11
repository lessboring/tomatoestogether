import * as React from 'react';
import * as DocumentTitle from 'react-document-title';
import {Link} from 'react-router';
import {observer} from 'mobx-react';
import vm from '../view-model';


@observer
export default class Layout extends React.Component<{}, {}> {
    render() {
        return (
			<div>
                <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
                    <button className="navbar-toggler navbar-toggler-right" type="button" onClick={vm.toggleMenu}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <a className="navbar-brand" href="#">
                        <img className="tomato-logo" src="/assets/tomato.png"/>
                        Tomatoes Together
                    </a>
                    <div className={'collapse navbar-collapse ' + (vm.menuExpanded ? 'show' : '')}>
                        <div className="navbar-nav">
                            <Link className="nav-item nav-link active" to="/">Home</Link>
                            <Link className="nav-item nav-link" to="/ideas">Ideas</Link>
                            <Link className="nav-item nav-link" to="/projects">Projects</Link>
                            <Link className="nav-item nav-link" to="/calendar">Calendar</Link>
                            <Link className="nav-item nav-link" to="/tags">Tags</Link>
                            <Link className="nav-item nav-link" to="/stats">Stats</Link>
                        </div>
                        <div className="navbar-nav ml-auto">
                            <Link className="nav-item nav-link" to="/login">Log In</Link>
                            <Link className="nav-item nav-link" to="/signup">Sign Up</Link>
                            <Link className="nav-item nav-link" to="/logout">Log Out</Link>
                        </div>
                    </div>
                </nav>
                {this.props.children}
            </div>
		);
	}
}
