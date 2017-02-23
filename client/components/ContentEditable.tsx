import * as React from 'react';
import * as ReactDOM from 'react-dom';

export default class ContentEditable extends React.Component<{
    html: string,
	children?: any,
    onChange: (html: string) => void,
}, {}> {
    lastHtml: string = '';
    render() {
        return (
            <div className="task-node">
                <div
                    onInput={this.emitChange}
                    onBlur={this.emitChange}
                    contentEditable
                    dangerouslySetInnerHTML={{__html: this.props.html}}
                ></div>
                {this.props.children}
            </div>
        );
    }

    shouldComponentUpdate(nextProps: any) {
        return nextProps.html !== ReactDOM.findDOMNode(this).innerHTML;
    }

    componentDidUpdate() {
        const node = ReactDOM.findDOMNode(this);
        if (this.props.html !== node.innerHTML) {
            node.innerHTML = this.props.html;
        }
    }

    emitChange() {
        const node = ReactDOM.findDOMNode(this);
        var html = node.innerHTML;
        if (this.props.onChange && html !== this.lastHtml) {
            this.props.onChange(html);
        }
        this.lastHtml = html;
    }
}
