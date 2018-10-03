<template>
    <div class="container mt-3">
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">

                <h1 class="display-2 text-center nowrap">
                    {{ tomato.remaining }}
                </h1>

                <div class="form-group">
                    <div class="row">
                        <div class="col"></div>
                        <div class="col text-center">
                            <button type="button"
                                    class="btn btn-primary rounded-circle"
                                    style="width: 100px; height: 100px; font-size: 3rem"
                                    @click.prevent="toggleRunning">
                                <font-awesome-icon v-if="running" icon="pause" />
                                <font-awesome-icon v-else icon="play" />
                            </button>
                        </div>
                        <div class="col text-center">
                            <button type="button" class="btn btn-sm btn-default mt-4">Reset</button>
                        </div>
                    </div>
                </div>

                <form novalidate @submit.prevent="submit">
                    <div class="form-group">
                        <label>Current Project</label>
                        <select
                         class="form-control"
                         v-model="tomato.project">
                            <option
                         v-for="project in projects"
                         :key="project.id"
                         :value="project.id">
                            {{ project.name }}
                            </option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Current Task</label>
                        <input
                         class="form-control"
                         type="text"
                         v-model="tomato.task"
                         placeholder="A short summary of what you are working on."
                         />
                    </div>
                    <button type="submit" class="btn btn-lg btn-block btn-success">Done!</button>

                </form>

            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

const padZeros = (value) => {
    const str = value.toString();
    if (str.length === 1) {
        return '0' + str;
    } else {
        return str;
    }
};

const blankTomato = (minutes) => {
    return {
        id: null,
        project: null,
        task: '',
        intervalStart: null,
        duration: moment.duration(minutes, 'minutes'),
        remaining: moment.duration(minutes, 'minutes'),
    };
};

export default {
    name: 'TomatoTimer',
    data() {
        return {
            user: {
                id: 1,
                email: 'david@lessboring.com',
                name: 'David Colgan',
            },

            projects: [{
                id: 1,
                name: 'Business Development',
            }, {
                id: 2,
                name: 'Email Newsletter',
            }, {
                id: 3,
                name: 'Client 1',
            }, {
                id: 4,
                name: 'Client 2',
            }],

            tomato: blankTomato(25),

            now: moment(),
            running: false,
            loading: false,
        };
    },

    computed: {
        remaining() {
            if (this.running) {
                const currentElapsed = this.now.diff(this.tomato.intervalStart);
                return this.tomato.duration.clone().add(currentElapsed);
            } else {
                return this.tomato.duration;
            }
        },
        hours() {
            return this.remaining.hours();
        },
        minutes() {
            return this.remaining.minutes();
        },
        seconds() {
            return this.remaining.seconds();
        },
        timeDisplay() {
            return `${
                padZeros(this.hours)
            }:${
                padZeros(this.minutes)
            }:${
                padZeros(this.seconds)
            }`;
        },
    },

    methods: {
        toggleRunning() {
            if (this.running) {
                this.running = false;
                this.tomato.duration = this.tomato.duration.clone().add(
                    moment.duration(moment().diff(this.tomato.intervalStart)),
                );
                this.tomato.intervalStart = null;
            } else {
                this.running = true;
                this.intervalStart = this.now;
            }
        },

        tick() {
            if (this.running) {
                this.now = moment();
            }
        },

        reset() {
            this.tomato = blankTomato(25);
        },

        submit() {
            this.loading = true;
            axios.post('/api/tomatoes/', this.tomato).then(() => {
                this.loading = false;
                this.reset();
            });
        },
    },

    mounted() {
        this.timerId = setInterval(() => this.tick(), 100);
    },

    destroyed() {
        clearInterval(this.timerId);
    },

};
</script>
