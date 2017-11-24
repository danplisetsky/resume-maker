(function () {

    const createColorPicker = (el, left) => {
        let colorPicker = document.createElement('input');
        colorPicker.setAttribute('type', 'color');
        colorPicker.setAttribute('id', 'colorPicker');
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
                if (!(coord.left <= ev.clientX && ev.clientX <= coord.right && coord.top <= ev.clientY && ev.clientY <= coord.bottom))
                    el.parentNode.removeChild(document.getElementById('colorPicker'));
            }
        });
    };

    const createInput = el => {
        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('value', el.innerHTML);

        input.style.fontSize = getComputedStyle(el).fontSize;        
        input.style.fontWeight = getComputedStyle(el).fontWeight;

        input.onkeydown = ev => {
            if (ev.code == 'Enter') {
                el.innerHTML = input.value;
                el.style.display = 'block';
                input.parentNode.removeChild(input);
            }
        };

        let div = document.createElement('div');
        div.appendChild(input);

        return div;
    };

    const attachEditBehavior = className => {
        let els = [...document.getElementsByClassName(className)];
        els.forEach(el => {
            el.ondblclick = ev => {
                let input = createInput(el);
                el.parentNode.insertBefore(input, el.nextSibling);
                input.firstChild.focus();
                el.style.display = 'none';
            };
        })
    };

    attachColorPickers('canPickColor');
    attachEditBehavior('canEdit');
})();