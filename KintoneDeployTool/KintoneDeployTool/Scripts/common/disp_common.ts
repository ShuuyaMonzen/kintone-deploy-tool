import TomSelect from "tom-select"
import { TomInput } from "tom-select/dist/types/types";

document.addEventListener('DOMContentLoaded', () => {
    //.tom-selectがあればTomSelect要素(コンボボックス)に置き換える
    document.querySelectorAll('.tom-select').forEach((el) => {
        new TomSelect(el as TomInput, {});
    });

    //行削除をする
    let buttons = document.getElementsByClassName('deleteRow');
    for (var i = 0; i < buttons?.length ?? 0; i++) {
        var button = buttons[i];
        button.addEventListener('click', (event) => {
            var buttonElement = event.target as HTMLElement;
            var rowElement = buttonElement.closest("tr");
            rowElement?.remove();

            event.stopPropagation();
        });
    }
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