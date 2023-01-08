import { Spinner } from 'spin.js';
var opts = {
    lines: 13 // The number of lines to draw
    ,
    length: 28 // The length of each line
    ,
    width: 14 // The line thickness
    ,
    radius: 42 // The radius of the inner circle
    ,
    scale: 1 // Scales overall size of the spinner
    ,
    corners: 1 // Corner roundness (0..1)
    ,
    color: '#000' // #rgb or #rrggbb or array of colors
    ,
    opacity: 0.25 // Opacity of the lines
    ,
    rotate: 0 // The rotation offset
    ,
    direction: 1 // 1: clockwise, -1: counterclockwise
    ,
    speed: 1 // Rounds per second
    ,
    trail: 60 // Afterglow percentage
    ,
    fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    ,
    zIndex: 2e9 // The z-index (defaults to 2000000000)
    ,
    className: 'spinner' // The CSS class to assign to the spinner
    ,
    top: '50%' // Top position relative to parent
    ,
    left: '50%' // Left position relative to parent
    ,
    shadow: false // Whether to render a shadow
    ,
    hwaccel: false // Whether to use hardware acceleration
    ,
    position: 'absolute' // Element positioning
};
//描画先の親要素
var spin_target = document.getElementById('spin-area');
//スピナーオブジェクト
var spinner = new Spinner(opts).spin();
var spinnerLayer = document.getElementById('layer');
if (spin_target != null && spinnerLayer != null && spinner.el) {
    spinnerLayer.hidden = true;
    spin_target.hidden = true;
    spinner.spin(spin_target);
    spin_target.appendChild(spinner.el);
}
export var spinnerUtil = {
    startSpinner: function () {
        var allInput = document.querySelectorAll('input');
        allInput.forEach(function (inputElement) {
            inputElement.disabled = true;
        });
        if (spin_target != null && spinnerLayer != null) {
            spinner.stop;
            spinner.spin(spin_target);
            spinnerLayer.hidden = false;
            spin_target.hidden = false;
        }
    },
    stopSpinner: function () {
        var allInput = document.querySelectorAll('input');
        allInput.forEach(function (inputElement) {
            inputElement.disabled = false;
        });
        if (spin_target != null && spinnerLayer != null) {
            spinner.stop;
            spinnerLayer.hidden = true;
            spin_target.hidden = true;
        }
    }
};
//# sourceMappingURL=spinnerUtil.js.map