(function () {
'use strict';

const DeleteAction = {
    DeleteParent: 1,
    DeleteSelf: 2,
    DeleteSelfAndParentIfLast: 3,
    DeleteParentIfNotLast: 4
};

HTMLElement.prototype.insertAfter = function insertAfter(newElement) {
    this.parentNode.insertBefore(newElement, this.nextSibling);
};

MouseEvent.prototype.getClientXY = function getClientXY() {
    return [this.clientX, this.clientY];
};

const forEachElem = selector =>
    (action, ...args) => {
        const els = [...document.querySelectorAll(selector)];
        els.forEach(el => action(el, args));
    };

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
            case 'behaviors':
                for (const item of attributes.behaviors)
                    item(elem);
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
        });
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
        return colorPicker = createElement('input', {
            type: 'color',
            onchange: ev =>
                el.style.backgroundColor = ev.target.value
        });
    };

    el.addEventListener('dblclick', () =>
        createColorPicker().click());
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

    const createDivWithIcons = () => {
        const img = createElement('img', {
            className: 'actionIcon',
            src: 'img/delete.svg',
            alt: 'img/delete.svg'.match(/\/(\w+).svg$/)[1],
            onclick: ev => {
                switch (deleteAction[0]) {
                    case DeleteAction.DeleteParent:
                        el.parentNode.remove();
                        break;
                    case DeleteAction.DeleteSelf:
                        el.remove();
                        break;
                    case DeleteAction.DeleteSelfAndParentIfLast:
                        if (el.parentNode.querySelectorAll('li').length === 1)
                            el.parentNode.remove();
                        else
                            el.remove();
                        break;
                }
                actionContainer.remove();
            }
        });

        const actionContainer = createElement('div', {
            className: 'actionContainer',
            style: {
                left: `${el.offsetLeft + el.offsetWidth + 3}px`,
                top: `${el.offsetTop + 3}px`
            },
            children: [img],
            onmouseleave: ev => actionContainer.remove()
        });

        return actionContainer;
    };

    el.addEventListener('mouseover', ev =>
        el.insertAfter(createDivWithIcons()));

    el.addEventListener('mouseleave', ev => {
        forEachElem('.actionContainer')
            (deleteElementIfNotHoveredOver,
            ev.getClientXY(), { left: 10 });
    });

};


const deleteMap = new Map([
    ['.nameOfSection', DeleteAction.DeleteParent],
    ['.section>p', DeleteAction.DeleteSelf],
    ['div.inline', DeleteAction.DeleteSelf],
    ['div.multiple>p.description', DeleteAction.DeleteParent],
    ['div.multiple>p:not(.description)', DeleteAction.DeleteSelf],
    ['div.project>p.projName', DeleteAction.DeleteParent],
    ['div.project>p:not(.projName)', DeleteAction.DeleteSelf],
    ['div.project li', DeleteAction.DeleteSelfAndParentIfLast],
    ['div.job>p.date', DeleteAction.DeleteParent]
]);

const deleteStuff = deleteMap => {
    deleteMap.forEach((value, key, _) => {
        forEachElem(`#grid ${key}`)(attachDeleteBehavior, value);
    });
};

deleteStuff(deleteMap);




const createActionContainer = el => {
    const actionContainer = createElement('div', {
        className: 'actionContainer',
        style: {
            left: `${el.offsetLeft + el.offsetWidth + 3}px`,
            top: `${el.offsetTop + 3}px`
        },
        children: createActionIcons(el),
        onmouseleave: ev => actionContainer.remove()
    });

    return actionContainer;
};

const createSection = () => {
    const h3 = createElement('h3', {
        className: 'canPickColor nameOfSection deleteParentIfNotLast',
        innerText: 'section'
    });
    h3.addEventListener('mouseover', () =>
        h3.insertAfter(createActionContainer(h3))
    );
    h3.addEventListener('mouseleave', ev =>
        forEachElem('.actionContainer')
            (deleteElementIfNotHoveredOver, ev.getClientXY(), { left: 10 })
    );

    return createElement('div', {
        className: 'section',
        children: [h3]
    });
};






const createTextElement = () => {
    return createElement('p', {
        className: 'canEdit deleteSelf',
        innerText: 'text',
        behaviors: [attachEditBehavior]
    });
};

const createDescriptionElement = () => {
    return createElement('div', {
        className: 'inline deleteSelf',
        children: [
            createElement('p', {
                className: 'description canEdit',
                innerText: 'description',
                behaviors: [attachEditBehavior]
            }),
            createElement('p', {
                className: 'canEdit',
                innerText: 'text',
                behaviors: [attachEditBehavior]
            })
        ]
    });
};

const createListElement = () => {
    return createElement('div', {
        className: 'multiple',
        children: [
            createElement('p', {
                className: 'description canEdit deleteParent',
                innerText: 'description'
            }),
            createElement('p', {
                className: 'canEdit deleteSelf',
                innerText: 'text'
            })
        ]
    });
};



const createAction = (el, actionName) => {
    return ev =>
        el.parentNode.lastChild.insertAfter(actionName());
};


const createActionIcons = el => {

    const createIcon = ([name, actionName]) => {
        return createElement('img', {
            className: 'actionIcon',
            src: `img/${name}.svg`,
            alt: name,
            onclick: createAction(el, actionName)
        });
    };

    const actionIcons = new Map([
        ['addText', createTextElement],
        ['addDescription', createDescriptionElement],
        ['addList', createListElement]
    ]);

    return [...actionIcons].map(item => createIcon(item));
};




const addSectionToColumn = CVGridColumn => {
    forEachElem(`#${CVGridColumn}`)(column =>
        column.appendChild(createSection()));
};

addSectionToColumn('fstColumn');



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

}());
