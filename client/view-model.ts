import {observable, computed, action} from 'mobx';
import * as util from './util';
import * as types from './types';


class ViewModel {
    @observable menuExpanded: boolean = false;
    @observable currentTime: Date = new Date();
    @observable minutesLeft: number = 0;
    @observable secondsLeft: number = 0;
    @observable state: types.TomatoState = 'break';

    @action toggleMenu = () => {
        this.menuExpanded = !this.menuExpanded;
    }

    @action tick = () => {
        this.currentTime = new Date();
        [this.minutesLeft, this.secondsLeft, this.state] = util.tomatoTimeFromHourTime(this.currentTime);
    }

    @computed get formattedTime(): string {
        return util.formatTomatoClock(this.minutesLeft, this.secondsLeft);
    }
}

const vm = new ViewModel();

setInterval(vm.tick, 1000);

export default vm;
