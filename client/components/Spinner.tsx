import * as React from 'react';
import ReactSpin from 'react-spin';

const Spinner = () => (
    <div style={{
        width: 300,
        height: 300,
    }}>
        <ReactSpin config={{
            lines: 13,
            length: 28,
            width: 14,
            radius: 42,
            scale: 1,
            corners: 1,
            color: '#2FEE2B',
            opacity: 0.25,
            rotate: 0,
            direction: 1,
            speed: 1,
            trail: 60,
            fps: 20,
            zIndex: 2e9,
            className: 'spinner',
            top: '50%',
            left: '50%',
            shadow: false,
            hwaccel: false,
            position: 'absolute',
        }}/>
    </div>
)


export default Spinner;
