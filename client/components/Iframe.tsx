import * as React from 'react';
import {store} from '../store';


export default function Iframe(props: {src: string}) {
    return (
        <div style={{visibility: store.isTomato ? 'hidden' : 'visible'}}>
            <iframe src={props.src} width={window.innerWidth} height="400" frameBorder="0"></iframe>
        </div>
    );
}

