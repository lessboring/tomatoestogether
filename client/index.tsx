import * as React from 'react';
import { render } from 'react-dom';
import App from './App';
import Store from './store';


const store = new Store();
setInterval(store.tick, 1000);


export default () => {
    render(
        <App store={store}/>,
        document.getElementById('app')
    );
}
