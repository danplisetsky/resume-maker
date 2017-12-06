(function () {

    const forEachElem = selector =>
        action => {
            const els = [...document.querySelectorAll(selector)];
            els.forEach(el => action(el));
        }

    const attachColorPickers = el => {

        const createColorPicker = (el, left) => {
            const colorPicker = document.createElement('input');
            colorPicker.setAttribute('type', 'color');
            colorPicker.setAttribute('id', 'colorPicker');
            colorPicker.style.left = `${left - 22}px`;

            colorPicker.onchange = ev => el.style.color = ev.target.value;

            colorPicker.onmouseleave = ev => colorPicker.parentNode.removeChild(colorPicker);

            return colorPicker;
        };

        el.onmouseover = ev => el.parentNode.insertBefore(createColorPicker(el, ev.clientX), el.nextSibling);

        el.onmouseleave = ev => {
            const colorPicker = document.getElementById('colorPicker');
            const coord = colorPicker.getBoundingClientRect();
            if (!(coord.left <= ev.clientX && ev.clientX <= coord.right && coord.top <= ev.clientY && ev.clientY <= coord.bottom))
                el.parentNode.removeChild(document.getElementById('colorPicker'));
        }
    };

    const attachEditBehavior = el => {

        const createInput = el => {
            const input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('value', el.innerText);

            input.style.fontSize = getComputedStyle(el).fontSize;
            input.style.fontWeight = getComputedStyle(el).fontWeight;

            const prevDisplay = el.style.display;

            input.onkeydown = ev => {
                if (ev.code == 'Enter') {
                    el.innerText = input.value;
                    el.style.display = prevDisplay;
                    input.parentNode.parentNode.removeChild(input.parentNode);
                }
            };

            const div = document.createElement('div');
            div.appendChild(input);

            return div;
        };

        el.ondblclick = ev => {
            const input = createInput(el);
            el.parentNode.insertBefore(input, el.nextSibling);
            input.firstChild.focus();
            el.style.display = 'none';
            ev.stopPropagation();
        };
    };

    const attachBckgColorPickers = el => {

        const createColorPicker = el => {
            const colorPicker = document.createElement('input');
            colorPicker.setAttribute('type', 'color');
            colorPicker.setAttribute('id', 'bckgColorPicker');

            colorPicker.onchange = ev => {
                el.style.backgroundColor = ev.target.value;
                colorPicker.parentNode.removeChild(colorPicker);
            };

            return colorPicker;
        };

        el.ondblclick = ev => {
            const colorPicker = createColorPicker(el);
            el.parentNode.insertBefore(colorPicker, el.nextSibling);
            colorPicker.click();
        };
    };

    const wireupBehavior = () => {
        forEachElem('.canPickBackgroundColor')(attachBckgColorPickers);
        forEachElem('.canEdit')(attachEditBehavior);
        forEachElem('.canPickColor')(attachColorPickers);
    };

    const save = id => {
        const buttonSaveCV = document.getElementById(id);
        buttonSaveCV.onclick = ev => {
            const CV = document.getElementById('CV');
            const res = domJSON.toJSON(CV, {
                domProperties: [true, 'draggable', 'spellcheck', 'translate'],
                stringify: true
            });

            const name = document.getElementById('name').innerText + '.cv';
            const blob = new Blob([res], { type: "text/plain;charset=utf-8" });
            saveAs(blob, name);
        };
    };

    const load = id => {
        const buttonLoadCV = document.getElementById(id);
        buttonLoadCV.onchange = ev => {
            const file = buttonLoadCV.files[0];

            const reader = new FileReader();
            reader.onload = prEv => {
                const res = reader.result;
                const CV = document.getElementById('CV');
                const domCV = domJSON.toDOM(res);
                CV.parentNode.replaceChild(domCV, CV);
                wireupBehavior();
            };

            reader.readAsText(file);
        };
    };

    window.onload = () => {
        wireupBehavior();
        save('saveCV');
        load('loadCV');
    };

    

})();