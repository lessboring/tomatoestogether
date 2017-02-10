import {observable, computed, action} from 'mobx';


class ViewModel {
    @observable menuExpanded: boolean = false;

    @action toggleMenu = () => {
        this.menuExpanded = !this.menuExpanded;
    }
}

export default new ViewModel();
