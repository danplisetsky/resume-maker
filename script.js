(function () {

    const createColorPicker = (el, left) => {
        let colorPicker = document.createElement('input');
        colorPicker.setAttribute('type', 'color');
        colorPicker.setAttribute('id', 'colorPicker');
        colorPicker.style.position = 'absolute';
        colorPicker.style.left = `${left - 22}px`;

        colorPicker.onchange = ev => el.style.color = ev.target.value;

        colorPicker.onmouseleave = ev => colorPicker.parentNode.removeChild(colorPicker);

        return colorPicker;
    };

    const attachColorPickers = className => {
        let els = [...document.getElementsByClassName(className)];
        els.forEach(el => {
            el.onmouseover = ev => el.parentNode.insertBefore(createColorPicker(el, ev.clientX), el.nextSibling);

            el.onmouseleave = ev => {
                let colorPicker = document.getElementById('colorPicker');
                let coord = colorPicker.getBoundingClientRect();
                if ( !(coord.left <= ev.clientX && ev.clientX <= coord.right && coord.top <= ev.clientY && ev.clientY <= coord.bottom))
                    el.parentNode.removeChild(document.getElementById('colorPicker'));
            }
        });
    };

    attachColorPickers("canPickColor")
})();