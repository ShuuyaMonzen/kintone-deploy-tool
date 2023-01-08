import TomSelect from "tom-select"
import { TomInput } from "tom-select/dist/types/types";

document.addEventListener('DOMContentLoaded', () => {
    //.tom-selectがあればTomSelect要素(コンボボックス)に置き換える
    document.querySelectorAll('.tom-select').forEach((el) => {
        new TomSelect(el as TomInput, {});
    });
});

export class common {
    constructor() {
        this.replaceTomSelect();
    }

    /**
     * .tom-selectの要素をTomSelect要素(コンボボックス)に置き換える
     * */
    replaceTomSelect() {
        document.addEventListener('DOMContentLoaded', () => {
            //.tom-selectがあればTomSelect要素(コンボボックス)に置き換える
            document.querySelectorAll('.tom-select').forEach((el) => {
                new TomSelect(el as TomInput, {});
            });
        });
    }

    
};