(function () {

    const DeleteAction = {
        DeleteParent: 1,
        DeleteSelf: 2,
        DeleteSelfAndParentIfLast: 3
    };

    const forEachElem = (selector, ...args) =>
        action => {
            const els = [...document.querySelectorAll(selector)];
            els.forEach(el => action(el, args));
        }

    const attachColorPickers = el => {

        const createColorPicker = (el, left) => {
            const colorPicker = document.createElement('input');
            colorPicker.setAttribute('type', 'color');
            colorPicker.className = 'colorPicker';
            colorPicker.style.left = `${left - 22}px`;

            colorPicker.onchange = ev => el.style.color = ev.target.value;

            colorPicker.onmouseleave = ev => colorPicker.parentNode.removeChild(colorPicker);

            return colorPicker;
        };

        el.addEventListener('mouseover', ev => el.parentNode.insertBefore(createColorPicker(el, ev.clientX), el.nextSibling));

        el.addEventListener('mouseleave', ev => {
            forEachElem('.colorPicker')(colorPicker => {
                const coord = colorPicker.getBoundingClientRect();
                if (!(coord.left <= ev.clientX && ev.clientX <= coord.right && coord.top <= ev.clientY + 10 && ev.clientY <= coord.bottom))
                    el.parentNode.removeChild(colorPicker);                
            });
        });
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





    const attachDeleteBehavior = (el, deleteAction) => {

        const createDivWithIcons = el => {
            const actionContainer = document.createElement('div');
            actionContainer.className = 'actionContainer';

            const coord = el.getBoundingClientRect();
            const elStyle = getComputedStyle(el);

            actionContainer.style.left = `${el.offsetLeft + el.offsetWidth + 3}px`;
            actionContainer.style.top = `${el.offsetTop + 3}px`;

            actionContainer.onmouseleave = ev => {
                actionContainer.parentNode.removeChild(actionContainer);
            };

            const img = document.createElement('img');
            img.className = 'actionIcon';
            img.src = 'img/delete.svg';
            img.alt = img.src.match(/\/(\w+).svg$/)[1];

            img.onclick = ev => {
                switch (deleteAction[0]) {
                    case DeleteAction.DeleteParent:
                        el.parentNode.parentNode.removeChild(el.parentNode);
                        break;
                    case DeleteAction.DeleteSelf:
                        el.parentNode.removeChild(el);    
                        break;
                    case DeleteAction.DeleteSelfAndParentIfLast:
                        if (el.parentNode.querySelectorAll('li').length == 1)
                            el.parentNode.parentNode.removeChild(el.parentNode);
                        else
                            el.parentNode.removeChild(el);
                        break;
                }
                actionContainer.parentNode.removeChild(actionContainer);
            };

            actionContainer.appendChild(img);

            return actionContainer;
        };


        el.addEventListener('mouseover', ev => {
            el.parentNode.insertBefore(createDivWithIcons(el),
                el.nextSibling);
        });

        el.addEventListener('mouseleave', ev => {
            forEachElem('.actionContainer')(actionContainer => {
                const coord = actionContainer.getBoundingClientRect();
                if (!(coord.left <= ev.clientX + 10 && ev.clientX <= coord.right && coord.top <= ev.clientY && ev.clientY <= coord.bottom))
                    el.parentNode.removeChild(actionContainer);
            });
        });

    };




    forEachElem('#grid .nameOfSection', DeleteAction.DeleteParent)(attachDeleteBehavior);
    forEachElem('#grid .section>p', DeleteAction.DeleteSelf)(attachDeleteBehavior);
    forEachElem('#grid div.inline', DeleteAction.DeleteSelf)(attachDeleteBehavior);
    forEachElem('#grid .multiple>p.description', DeleteAction.DeleteParent)(attachDeleteBehavior);
    forEachElem('#grid .multiple>p:not(.description)', DeleteAction.DeleteSelf)(attachDeleteBehavior);
    forEachElem('#grid .project>p.projName', DeleteAction.DeleteParent)(attachDeleteBehavior);
    forEachElem('#grid .project p:not(.projName)', DeleteAction.DeleteSelf)(attachDeleteBehavior);
    forEachElem('#grid .project li', DeleteAction.DeleteSelfAndParentIfLast)(attachDeleteBehavior);
    forEachElem('#grid .job>p.date', DeleteAction.DeleteParent)(attachDeleteBehavior);
    forEachElem('#grid .job p:not(.date)', DeleteAction.DeleteSelf)(attachDeleteBehavior);
    forEachElem('#grid .job li', DeleteAction.DeleteSelfAndParentIfLast)(attachDeleteBehavior);
    forEachElem('#grid .degree>p.date', DeleteAction.DeleteParent)(attachDeleteBehavior);
    forEachElem('#grid .degree p:not(.date)', DeleteAction.DeleteSelf)(attachDeleteBehavior);
})();