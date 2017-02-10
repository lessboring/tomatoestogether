import * as React from 'react';


interface FormFieldProps {
    type: string;
    name: string;
    value: string;
    onChange: any;
    placeholder?: string;
    before?: string;
    after?: string;
    rows?: number;
    className?: string;
    noMargin?: boolean;
}

export default class FormField extends React.Component<FormFieldProps, {}> {
    render() {
        const { type, name, value, onChange, placeholder, before, after, className, noMargin=false, ...rest  } = this.props;

        let input;
        if (type === 'textarea') {
            input = (
                <textarea
                    ref={name}
                    name={name}
                    className={'form-control ' + className}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    {...rest}
                />
            );
        }
        else {
            input = (
                <input
                    ref={name}
                    type={type}
                    name={name}
                    className={'form-control ' + className}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                />
            );
        }
        return (
            <fieldset className={'form-group ' +  (noMargin ? 'm-b-0' : '')}>
                {!placeholder && (
                    <label htmlFor={name}>
                        {name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ')}
                    </label>
                )}

                {(before || after) ? (
                    <div className="input-group">
                        {before && <span className="input-group-addon">{before}</span>}
                        {input}
                        {after && <span className="input-group-addon">{after}</span>}
                    </div>
                ): (
                    input
                )}
            </fieldset>
        );
    }
}
