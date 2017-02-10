import * as React from 'react';


const parseErrors = (errJson: {[name: string]: {key: string; errors: {errorMessage: string;}[];}}) => {
    const simpleErrors: [string, string][] = [];
    for (const name in errJson) {
        const errors = errJson[name].errors;
        for (const error of errors) {
            simpleErrors.push([name, error.errorMessage]);
        }
    }
    return simpleErrors;
};


const PageError = (props: {children?: any, error: any}) => {
    let i = 0;
    if (props.error) {
        return (
            <div>
                <div className="alert alert-danger" role="alert">
                    {parseErrors(props.error).map(([name, error]) => (
                        <p key={++i}><strong>{name}</strong>: {error}</p>
                    ))}
                </div>
                {props.children}
            </div>
        );
    }
    else {
        return <div>{props.children}</div>;
    }
};

export default PageError;
