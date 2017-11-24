(function () {

    const forEachElemOfClass = className =>
        action => {
            let els = [...document.getElementsByClassName(className)];
            els.forEach(el => action(el));
        }

    const attachColorPickers = el => {

        const createColorPicker = (el, left) => {
            let colorPicker = document.createElement('input');
            colorPicker.setAttribute('type', 'color');
            colorPicker.setAttribute('id', 'colorPicker');
            colorPicker.style.left = `${left - 22}px`;

            colorPicker.onchange = ev => el.style.color = ev.target.value;

            colorPicker.onmouseleave = ev => colorPicker.parentNode.removeChild(colorPicker);

            return colorPicker;
        };

        el.onmouseover = ev => el.parentNode.insertBefore(createColorPicker(el, ev.clientX), el.nextSibling);

        el.onmouseleave = ev => {
            let colorPicker = document.getElementById('colorPicker');
            let coord = colorPicker.getBoundingClientRect();
            if (!(coord.left <= ev.clientX && ev.clientX <= coord.right && coord.top <= ev.clientY && ev.clientY <= coord.bottom))
                el.parentNode.removeChild(document.getElementById('colorPicker'));
        }
    };

    const attachEditBehavior = el => {

        const createInput = el => {
            let input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('value', el.innerText);

            input.style.fontSize = getComputedStyle(el).fontSize;
            input.style.fontWeight = getComputedStyle(el).fontWeight;

            input.onkeydown = ev => {
                if (ev.code == 'Enter') {
                    el.innerText = input.value;
                    el.style.display = 'block';
                    input.parentNode.removeChild(input);
                }
            };

            let div = document.createElement('div');
            div.appendChild(input);

            return div;
        };

        el.ondblclick = ev => {
            let input = createInput(el);
            el.parentNode.insertBefore(input, el.nextSibling);
            input.firstChild.focus();
            el.style.display = 'none';
            ev.stopPropagation();
        };
    };

    const attachBckgColorPickers = el => {

        const createColorPicker = el => {
            let colorPicker = document.createElement('input');
            colorPicker.setAttribute('type', 'color');
            colorPicker.setAttribute('id', 'bckgColorPicker');

            colorPicker.onchange = ev => {
                el.style.backgroundColor = ev.target.value;
                colorPicker.parentNode.removeChild(colorPicker);
            };

            return colorPicker;
        };

        el.ondblclick = ev => {
            let colorPicker = createColorPicker(el);
            el.parentNode.insertBefore(colorPicker, el.nextSibling);
            colorPicker.click();
        };
    };

    forEachElemOfClass('canPickBackgroundColor')(attachBckgColorPickers);
    forEachElemOfClass('canEdit')(attachEditBehavior);
    forEachElemOfClass('canPickColor')(attachColorPickers);
})();