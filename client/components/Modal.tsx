import {observable, computed, action} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';


@observer
export default class Modal extends React.Component<{
    title: string,
    show: boolean,
    handleClose: () => void
    children?: any,
}, {}> {
    render() {
        return (
            <div>
                <div className="modal fade show" style={{display: this.props.show ? 'block' : 'none'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">{this.props.title}</h3>
                                <button type="button" className="close" onClick={this.props.handleClose}>
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                    <div className="overlay" style={{display: this.props.show ? 'block' : 'none'}} onClick={this.props.handleClose}></div>
                </div>
            </div>
        )
    }
}


