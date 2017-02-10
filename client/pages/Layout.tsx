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
                    <a className="navbar-brand" href="#">Navbar</a>
                    <div className={'collapse navbar-collapse ' + (vm.menuExpanded ? 'show' : '')}>
                        <div className="navbar-nav">
                            <a className="nav-item nav-link active" href="#">Home</a>
                            <a className="nav-item nav-link" href="#">Features</a>
                            <a className="nav-item nav-link" href="#">Pricing</a>
                            <a className="nav-item nav-link disabled" href="#">Disabled</a>
                        </div>
                    </div>
                </nav>
                {this.props.children}
            </div>
		);
	}
}

