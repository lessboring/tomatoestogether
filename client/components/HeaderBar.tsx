import * as React from 'react';


export default function HeaderBar() {
    return (
        <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
            <button className="navbar-toggler navbar-toggler-right" type="button" onClick={() => {}}>
                <span className="navbar-toggler-icon"></span>
            </button>
            <a className="navbar-brand" href="#">
                <img className="tomato-logo" src="/assets/tomato.png"/>
                Tomatoes Together
            </a>
            <div className={'collapse navbar-collapse ' + (true ? 'show' : '')}>
                <div className="navbar-nav">
                    <a className="nav-item nav-link active" href="#">Home</a>
                    <a className="nav-item nav-link" href="#">Features</a>
                    <a className="nav-item nav-link" href="#">Pricing</a>
                </div>
            </div>
        </nav>
    );
}
