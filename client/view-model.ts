import {observable, ObservableMap, asMap, computed, action} from 'mobx';

class ErrorManager {
    @observable errors: string[] = [];

    @computed get has() {
        return this.errors.length > 0;
    }

    @action add(error: string) {
        this.errors.push(error);
    }
}



class ViewModel {
    @observable errors: ErrorManager = new ErrorManager();
    @observable focusedTaskId: number = 0;
    @observable menuExpanded: boolean = false;
    @action toggleMenu = () => {
        this.menuExpanded = !this.menuExpanded;
    }
}

export default new ViewModel();
