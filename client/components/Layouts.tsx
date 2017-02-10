import * as React from 'react';

export const CardLayout = (props: { cols?: string, children?: any }) => {
    let cssClass = '';
    if (!props.cols) {
        cssClass = 'col-md-12';
    }
    else if (props.cols === '4') {
        cssClass = 'col-md-4 col-md-offset-4';
    }
    else if (props.cols === '6') {
        cssClass = 'col-md-6 col-md-offset-3';
    }
    else if (props.cols === '8') {
        cssClass = 'col-md-8 col-md-offset-2';
    }
    else if (props.cols === '10') {
        cssClass = 'col-md-10 col-md-offset-1';
    }
    else if (props.cols === '12') {
        cssClass = 'col-md-12';
    }

    return (
        <div className="container">
            <div className="row">
                <div className={cssClass}>
                    <div className="card">
                        <div className="card-block">
                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
