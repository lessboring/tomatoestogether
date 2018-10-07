<template>
    <div class="card">
        <div class="card-body">
            <timer-face :class="{
                    'bg-danger': isTomato,
                    'bg-success': !isTomato,
                }"
                :label="faceLabel"
                :milliseconds="faceTime"
                :body="faceBody"
            />
            <template v-if="!isStarted || isBreak">
                <select-project
                    v-model="currentTomato.project"
                    :projects="projects"
                />

                <div class="form-group">
                    <input class="form-control"
                            type="text"
                            v-model="currentTomato.currentTask"
                            placeholder="Current task" />
                </div>

                <select-duration
                    v-model="currentTomato.duration"
                    :durations="durations"
                />
            </template>
            <template v-else>
                <ul v-if="currentTomato.tasks">
                    <li v-for="(task, i) in currentTomato.tasks" :key="i"><s>{{ task }}</s></li>
                </ul>
                <h4>{{ currentTomato.currentTask }}</h4>
            </template>

            <div v-if="!isStarted || !isTomato" class="row">
                <div class="col-3">
                    <button type="button" class="btn btn-block btn-default" @click="reset">Reset</button>
                </div>
                <div class="col-9">
                    <button type="text" class="btn btn-block btn-success" @click="startTomato()">
                        <span v-if="isBreak">Start Another Tomato</span>
                        <span v-else>Start Tomato</span>
                    </button>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
/*
Valid states:

load data from localstorage if exists

Click reset to move to Initial state
Set tomato to new tomato


1. Initial state
    click submit button to move to During tomato

2. During tomato
    Click done with task to mark a task complete and enter a new one
    When the timer gets to zero, move to During break

3. During break
    Automatically record the completed tomato with all tasks completed and the one in progress
    Duplicate the current tomato and fill in it's values into the boxes to allow easy continuing
    Click done to stop working
    Click start another to start another work period

4.
*/

import TimerFace from './TimerFace';
import SelectDuration from './SelectDuration';
import SelectProject from './SelectProject';

import {
    newTomato, newBreak,
    loadState, saveState,
} from '../tomato';

import {
    getDjangoJSON,
    setHTML,
    timeToDjango,
    durationToDjango,
} from '../util';
import { postForm } from '../http';

export default {
    components: {
        'timer-face': TimerFace,
        'select-duration': SelectDuration,
        'select-project': SelectProject,
    },
    name: 'TomatoTimer',
    data() {
        const {
            currentTomato,
            currentBreak,
        } = loadState() || {
            currentTomato: newTomato(),
            currentBreak: null,
        };

        return {
            projects: getDjangoJSON('projects-data'),
            durations: getDjangoJSON('durations-data'),

            currentTomato,
            currentBreak,

            loading: false,
            now: +new Date(),
        };
    },

    computed: {
        breakElapsed() {
            return this.now - this.currentBreak.start;
        },
        tomatoRemaining() {
            if (this.isStarted) {
                return this.currentTomato.duration - (
                    this.now - this.currentTomato.start
                );
            } else {
                return this.currentTomato.duration || 0;
            }
        },
        isTomato() {
            return this.currentBreak === null;
        },
        isBreak() {
            return this.currentBreak !== null;
        },
        isStarted() {
            return this.currentTomato && this.currentTomato.start !== null;
        },

        faceLabel() {
            if (this.isBreak) {
                return 'Break time!';
            } else {
                return 'Work time!';
            }
        },
        faceTime() {
            return (this.isBreak
                ? this.breakElapsed
                : this.tomatoRemaining
            );
        },

        faceBody() {
            try {
                return this.projects.find(({ id }) => {
                    return this.currentTomato.project === id;
                }).name;
            } catch (_) {
                return '';
            }
        },
    },

    methods: {
        reset() {
            this.currentTomato = newTomato();
            this.currentBreak = null;
            this.tick();
        },

        tick() {
            this.now = +new Date();
            if (this.isTomato && this.isStarted && this.tomatoRemaining < 0) {
                this.completeTomato();
            }
            saveState(this.currentTomato, this.currentBreak);
        },

        startTomato() {
            if (this.currentBreak !== null) {
                //this.loading = true;
                //postForm('/breaks/complete/', {
                //    task: this.currentBreak.task,
                //    duration: durationToDjango(this.breakElapsed),
                //    start: timeToDjango(this.currentBreak.task),
                //}).then((res) => {
                //    setHTML('tomato-list-container', res.data);
                //    this.loading = false;
                //});
                this.currentBreak = null;
            }
            this.currentTomato.start = +new Date();
        },

        completeTomato() {
            this.loading = true;
            postForm('/tomatoes/complete/', {
                project: this.currentTomato.project,
                tasks: [].concat(
                    this.currentTomato.completedTasks,
                    this.currentTomato.currentTask || [],
                ).join(', '),
                duration: durationToDjango(this.currentTomato.duration),
                start: timeToDjango(this.currentTomato.start),
            }).then((res) => {
                setHTML('tomato-list-container', res.data);
                this.loading = false;
            });
            this.currentTomato = newTomato(this.currentTomato);
            this.currentBreak = newBreak();
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
