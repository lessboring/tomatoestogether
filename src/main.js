import Vue from 'vue';
//import Turbolinks from 'turbolinks';
import $ from 'jquery';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import App from './App';

//Turbolinks.start();

library.add(faPlay);
library.add(faPause);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#tomato-timer-app',
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
