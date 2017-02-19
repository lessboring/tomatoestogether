import * as React from 'react';


export default function Iframe(props: {src: string}) {
    return (
        <iframe src={props.src} height="400" frameBorder="0"></iframe>
    );
}

