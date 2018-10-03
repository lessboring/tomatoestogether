import Vue from 'vue';
//import Turbolinks from 'turbolinks';
import $ from 'jquery';

import App from './App';

//Turbolinks.start();

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    render: h => h(App),
});

window.$ = $;

/*
$(document).on('submit', 'form:not(.js-cm)', (e) => {
    e.preventDefault();

    const $form = $(e);
    const action = $form.attr('action');
    const method = $form.attr('method');
    const data = $form.serialize();
    const referrer = window.location.href;

    if (method === 'get') {
        return Turbolinks.visit(`${action}?${data}`);
    }

    return $.ajax(action, {
        method,
        body: data,
        headers: {
            'Turbolinks-Referrer': referrer,
        },
    }, (err, resp, req) => {
        if (req.getResponseHeader('content-type').match(/javascript/)) {
            eval(resp);
        } else {
            const snapshot = Turbolinks.Snapshot.wrap(resp);
            Turbolinks.controller.cache.put(referrer, snapshot);
            Turbolinks.visit(referrer, {action: "restore"});
        }
    });
});
*/
