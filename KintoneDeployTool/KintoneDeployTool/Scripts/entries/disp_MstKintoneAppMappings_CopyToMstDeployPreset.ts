
document.addEventListener('DOMContentLoaded', () => {
    let form = (document.querySelector('#form') as HTMLInputElement);
    form.addEventListener('submit', (ev) => {

        var selects = document.querySelectorAll('select');
        selects.forEach(select => {
            select.disabled = false;
        });
        return true;
    });
});