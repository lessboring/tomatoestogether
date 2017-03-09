import * as React from 'react';
import * as ReactDOM from 'react-dom';

export default class ContentEditable extends React.Component<{
    html: string,
    style?: any,
    className?: string,
    onChange: (html: string) => void,
    focused?: boolean,
    onKeyDown?: React.KeyboardEventHandler<{}>;
}, {}> {
    ref: any;
    lastHtml: string = '';

    render() {
        return (
            <div
                style={this.props.style}
                ref={(c) => {
                    this.ref = c;
                }}
                className={this.props.className}
                onKeyDown={this.props.onKeyDown}
                onInput={this.emitChange}
                onBlur={this.emitChange}
                contentEditable
                dangerouslySetInnerHTML={{__html: this.props.html}}
            ></div>
        );
    }

    shouldComponentUpdate(nextProps: any) {
        return nextProps.html !== ReactDOM.findDOMNode(this).innerHTML;
    }

    componentDidUpdate() {
        console.log('componentDidUpdate');
        const node = ReactDOM.findDOMNode(this);
        if (this.props.html !== node.innerHTML) {
            node.innerHTML = this.props.html;
        }
        console.log(this.props.focused);
        if (this.props.focused) {
            console.log('focused', this.ref);
            this.ref.focus();
        }
    }

    emitChange = (e: any) => {
        const node = ReactDOM.findDOMNode(this);
        const html = node.innerHTML;
        if (this.props.onChange && html !== this.lastHtml) {
            this.props.onChange(html);
        }
        this.lastHtml = html;
    }
}
