(function () {

    HTMLElement.prototype.insertAfter = function (newElement) {
        this.parentNode.insertBefore(newElement, this.nextSibling);
    };

    MouseEvent.prototype.getClientXY = function () {
        return [this.clientX, this.clientY];
    };

    const DeleteAction = {
        DeleteParent: 1,
        DeleteSelf: 2,
        DeleteSelfAndParentIfLast: 3
    };

    const forEachElem = selector =>
        (action, ...args) => {
            const els = [...document.querySelectorAll(selector)];
            els.forEach(el => action(el, args));
        }

    const createElement = (tag, attributes) => {
        const elem = document.createElement(tag);
        for (const attr in attributes) {

            switch (attr) {
                case 'style':
                    for (const rule in attributes.style)
                        elem.style[rule] = attributes.style[rule];
                    break;
                case 'children':
                    for (const item of attributes.children)
                        elem.appendChild(item);
                    break;
                default:
                    elem[attr] = attributes[attr];
                    break;
            }

        }
        return elem;
    };

    const deleteElementIfNotHoveredOver = (
        elem,
        [[clientX, clientY],
            { left = 0, top = 0, right = 0, bottom = 0 }]) => {
        const coord = elem.getBoundingClientRect();
        if (!(coord.left <= clientX + left && clientX - right <= coord.right && coord.top <= clientY + top && clientY - bottom <= coord.bottom))
            elem.remove();
    };

    const attachColorPickers = el => {

        const createColorPicker = clientX => {
            const colorPicker = createElement('input', {
                className: 'colorPicker',
                type: 'color',
                style: {
                    left: `${clientX - 22}px`
                },
                onchange: ev => el.style.color = ev.target.value,
                onmouseleave: ev => colorPicker.remove()
            });

            return colorPicker;
        };

        el.addEventListener('mouseover', ev =>
            el.insertAfter(createColorPicker(ev.clientX)));

        el.addEventListener('mouseleave', ev =>
            forEachElem('.colorPicker')
                (deleteElementIfNotHoveredOver, ev.getClientXY(), { top: 10 }));
    };

    const attachEditBehavior = el => {

        const createInput = () => {
            const elStyle = getComputedStyle(el);
            const prevDisplay = el.style.display;

            const input = createElement('input', {
                type: 'text',
                value: el.innerText,
                style: {
                    fontSize: elStyle.fontSize,
                    fontWeight: elStyle.fontWeight
                },
                onkeydown: ev => {
                    if (ev.code === 'Enter') {
                        el.innerText = input.value;
                        el.style.display = prevDisplay;
                        input.parentNode.remove();
                    }
                }
            });

            return createElement('div', {
                children: [input]
            })
        };

        el.addEventListener('dblclick', ev => {
            const input = createInput();
            el.insertAfter(input);
            input.firstChild.focus();
            el.style.display = 'none';
            ev.stopPropagation();
        });
    };

    const attachBckgColorPickers = el => {

        const createColorPicker = () => {
            const colorPicker = createElement('input', {
                type: 'color',
                id: 'bckgColorPicker',
                onchange: ev => {
                    el.style.backgroundColor = ev.target.value;
                    colorPicker.remove();
                }
            });

            return colorPicker;
        };

        el.addEventListener('dblclick', ev => {
            const colorPicker = createColorPicker();
            el.insertAfter(colorPicker);
            colorPicker.click();
        });
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
                        if (el.parentNode.querySelectorAll('li').length === 1)
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
                    actionContainer.parentNode.removeChild(actionContainer);
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




    const wireupBehavior = () => {
        forEachElem('.canPickBackgroundColor')(attachBckgColorPickers);
        forEachElem('.canEdit')(attachEditBehavior);
        forEachElem('.canPickColor')(attachColorPickers);       
    };

    window.onload = () => {
        wireupBehavior();
        save('saveCV');
        load('loadCV');
    };

})();