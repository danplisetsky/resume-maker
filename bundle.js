(function () {
'use strict';

const forEachElem = selector => {
    return (action, ...args) => {
        const els = [...document.querySelectorAll(selector)];
        els.forEach(el => action(el, args));
    }
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
                for (const [func, args] of attributes.behaviors)
                    func(elem, args);
            default:
                elem[attr] = attributes[attr];
                break;
        }

    }
    return elem;
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
                    forEachElem('.actionContainer')(ac => ac.remove());                    
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
        forEachElem('.actionContainer')(ac => ac.remove());
    });
};

const deleteElementIfNotHoveredOver = (
    elem,
    [
        [clientX, clientY],
        { left = 0, top = 0, right = 0, bottom = 0 }
    ]) => {
    const coord = elem.getBoundingClientRect();
    if (!(coord.left <= clientX + left && clientX - right <= coord.right && coord.top <= clientY + top && clientY - bottom <= coord.bottom))
        elem.remove();
};

const attachColorPicker = el => {

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
            (deleteElementIfNotHoveredOver, ev.getClientXY(), { top: 5 }));
};

const DeleteAction = {
    DeleteParent: 1,
    DeleteSelf: 2,
    DeleteSelfAndParentIfLast: 3,
    DeleteParentIfNotLast: 4
};

HTMLElement.prototype.insertAfter = function insertAfter(newElement) {
    this.parentNode.insertBefore(newElement, this.nextSibling);
};

HTMLElement.prototype.removeAllChildren = function removeAllChildren() {
    while (this.hasChildNodes())
        this.removeChild(this.lastChild);
};

HTMLElement.prototype.removeSelfAndNextSibling = function removeSelfAndNextSibling() {
    this.nextElementSibling.remove();
    this.remove();
};

MouseEvent.prototype.getClientXY = function getClientXY() {
    return [this.clientX, this.clientY];
};

const createTextElement = () => {
    return createElement('p', {
        className: 'canEdit deleteSelf',
        innerText: 'text',
        behaviors: new Map([
            [attachEditBehavior, ''],
            [attachActionContainer, 'delete']
        ])
    });
};

const createDescriptionElement = () => {
    return createElement('div', {
        className: 'inline deleteSelf',
        children: [
            createElement('p', {
                className: 'description canEdit',
                innerText: 'description',
                behaviors: new Map([
                    [attachEditBehavior, '']
                ])
            }),
            createElement('p', {
                className: 'canEdit',
                innerText: 'text',
                behaviors: new Map([
                    [attachEditBehavior, '']
                ])
            })
        ],
        behaviors: new Map([
            [attachActionContainer, 'delete']
        ])
    });
};

const createListElement = () => {
    return createElement('div', {
        className: 'multiple',
        children: [
            createElement('p', {
                className: 'description canEdit deleteParent',
                innerText: 'description',
                behaviors: new Map([
                    [attachEditBehavior, ''],
                    [attachActionContainer,
                        ['addText', 'delete']]
                ])
            }),
            createElement('p', {
                className: 'canEdit deleteSelf',
                innerText: 'text',
                behaviors: new Map([
                    [attachEditBehavior, ''],
                    [attachActionContainer, 'delete']
                ])
            })
        ]
    });
};

const createCompoundItem = () => {
    return createElement('div', {
        className: 'compoundItem',
        children: [
            createElement('p', {
                className: 'compoundItemName canEdit deleteParent',
                innerText: 'name',
                behaviors: new Map([
                    [attachEditBehavior, ''],
                    [attachActionContainer, 'delete']
                ])
            }),
            createElement('p', {
                className: 'compoundItemDescription canEdit deleteSelf',
                innerText: 'description',
                behaviors: new Map([
                    [attachEditBehavior, ''],
                    [attachActionContainer, 'delete']
                ])
            }),
            createElement('p', {
                className: 'compoundItemAdditionalInfo canEdit deleteSelf',
                innerText: 'additional info',
                behaviors: new Map([
                    [attachEditBehavior, ''],
                    [attachActionContainer, 'delete']
                ])
            }),
            createElement('ul', {
                className: 'compoundItemDetails',
                children: [
                    createDetailElement()
                ]
            })
        ]
    });
};

const createDetailElement = () => {
    return createElement('li', {
        className: 'canEdit deleteSelfAndParentIfLast',
        innerText: 'detail',
        behaviors: new Map([
            [attachEditBehavior, ''],
            [attachActionContainer,
                ['addDetail', 'delete']]
        ])
    })
};

const createDateItem = () => {
    return createElement('div', {
        className: 'dateItem',
        children: [
            createElement('p', {
                className: 'date canEdit deleteParent',
                innerText: '01/01/2000 -- Present',
                behaviors: new Map([
                    [attachEditBehavior, ''],
                    [attachActionContainer, 'delete']
                ])
            }),
            createCompoundItem()
        ]
    });
};

const createDeleteBehavior = el => {

    const mapDeleteAction = name => {
        switch (name) {
            case 'deleteParent':
                return DeleteAction.DeleteParent;
            case 'deleteSelf':
                return DeleteAction.DeleteSelf;
            case 'deleteSelfAndParentIfLast':
                return DeleteAction.DeleteSelfAndParentIfLast;
            case 'deleteParentIfNotLast':
                return DeleteAction.DeleteParentIfNotLast
            default:
                throw 'wrong delete class';
        }
    };

    const deleteAction = [...el.classList.values()]
        .filter(cl => cl.startsWith('delete'))
        .map(mapDeleteAction)[0];

    switch (deleteAction) {
        case DeleteAction.DeleteParent:
            el.parentNode.remove();
            break;
        case DeleteAction.DeleteSelf:
            el.removeSelfAndNextSibling(); //also removes actionContainer
            break;
        case DeleteAction.DeleteSelfAndParentIfLast:
            if (el.parentNode.querySelectorAll(el.tagName).length === 1)
                el.parentNode.remove();
            else
                el.removeSelfAndNextSibling(); //also removes actionContainer
            break;
        case DeleteAction.DeleteParentIfNotLast:
            if (el.parentNode.parentNode.querySelectorAll(`.${el.parentNode.className}`).length === 1)
                alert("Can't delete the last remaining section!");
            else
                el.parentNode.remove();
            break;
    }
};

const createAction = (el, actionName) => {
    switch (actionName.name) {
        case 'createDeleteBehavior':
            return () => createDeleteBehavior(el);
        case 'createSection':
            return () =>
                el.parentNode.parentNode.lastChild.insertAfter(createSection(el));
        case 'createDetailElement':
            return () =>
                el.insertAfter(createDetailElement());
        default:
            return () => el.parentNode.lastChild.insertAfter(actionName());
    }
};


const createActionIcons = (el, icons) => {

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
        ['addList', createListElement],
        ['addCompoundItem', createCompoundItem],
        ['addDateItem', createDateItem],
        ['addDetail', createDetailElement],
        ['addAfter', createSection],
        ['delete', createDeleteBehavior]
    ]);

    return [...actionIcons]
        .filter(([key]) => icons.includes(key))
        .map(item => createIcon(item));
};

const attachActionContainer = (el, icons) => {

    const createActionContainer = (left, top) => {
        const actionContainer = createElement('div', {
            className: 'actionContainer',
            style: {
                left: `${left + 3}px`,
                top: `${top + 3}px`
            },
            children: createActionIcons(el, icons),
            onmouseleave: ev => actionContainer.remove()
        });

        return actionContainer;
    };

    el.addEventListener('mouseover', ev =>
        el.insertAfter(createActionContainer(
            ev.currentTarget.offsetLeft + ev.currentTarget.offsetWidth,
            ev.target.offsetTop)
        )
    );

    el.addEventListener('mouseleave', ev =>
        forEachElem('.actionContainer')
            (deleteElementIfNotHoveredOver, ev.getClientXY(), { left: 5 })
    );
};

const createSection = (el, name = 'section') => {
    
    const defaultBehaviors = new Map([
        [attachEditBehavior, ''],
        [attachColorPicker, '']
    ]);

    return createElement('div', {
        className: 'section',
        children: [
            createElement('h3', {
                className:
                    'nameOfSection canPickColor  deleteParentIfNotLast',
                innerText: name,
                behaviors: el.id === 'fstColumn' || el.parentNode.parentNode.id === 'fstColumn'
                    ? new Map([
                        ...defaultBehaviors.entries(),
                        [attachActionContainer,
                            ['addText', 'addDescription', 'addList', 'addAfter', 'delete']]
                    ])
                    : new Map([
                        ...defaultBehaviors.entries(),
                        [attachActionContainer,
                            ['addCompoundItem', 'addDateItem', 'addAfter', 'delete']]   
                    ])
            })
        ]
    });
};

const attachBckgColorPicker = el => {

    const createColorPicker = () => {
        return createElement('input', {
            type: 'color',
            onchange: ev =>
                el.style.backgroundColor = ev.target.value
        });
    };

    el.addEventListener('dblclick', () =>
        createColorPicker().click());
};

const randomName = () => {
    return Math.random() < 0.5
        ? 'John Doe'
        : 'Jane Doe';
};

const createNewCV = id => {
    const buttonNewCV = document.getElementById(id);
    buttonNewCV.onclick = _ => newCV();
};

const setInitialAttributes = id => {
    const elem = document.getElementById(id);
    return (text = elem.innerHTML, color = null) => {
        elem.innerHTML = text;
        elem.className.includes('canPickBackgroundColor')
            ? elem.style.backgroundColor = color
            : elem.style.color = color;
    };
};


const saveCV = id => {
    const buttonSaveCV = document.getElementById(id);
    buttonSaveCV.onclick = ev => {

        //save header info (name, occupation, colors)
        //save cv        

        // const CV = document.getElementById('CV');
        // const res = domJSON.toJSON(CV, {
        //     domProperties: [true, 'draggable', 'spellcheck', 'translate'],
        //     stringify: true
        // });

        // const name = document.getElementById('name').innerText + '.cv';
        // const blob = new Blob([res], { type: "text/plain;charset=utf-8" });
        // saveAs(blob, name);
    };
};

// const load = id => {
//     const buttonLoadCV = document.getElementById(id);
//     buttonLoadCV.onchange = ev => {
//         const file = buttonLoadCV.files[0];

//         const reader = new FileReader();
//         reader.onload = prEv => {
//             const res = reader.result;
//             const CV = document.getElementById('CV');
//             const domCV = domJSON.toDOM(res);
//             CV.parentNode.replaceChild(domCV, CV);
//             wireupBehavior();
//         };

//         reader.readAsText(file);
//     };
// };

const wireupBehavior = () => {
    forEachElem('.canPickBackgroundColor')(attachBckgColorPicker);
    forEachElem('.canEdit')(attachEditBehavior);
    forEachElem('.canPickColor')(attachColorPicker);
};

const newCV = () => {
    const cleanColumn = (column, [nameOfFirstSection]) => {
        column.removeAllChildren();
        column.appendChild(createSection(column, nameOfFirstSection));
    };

    setInitialAttributes('header')();
    setInitialAttributes('name')(randomName());
    setInitialAttributes('occupation')('software developer');
    wireupBehavior(); //for elements always present on page

    forEachElem('#fstColumn')(cleanColumn, 'contact');
    forEachElem('#sndColumn')(cleanColumn, 'experience');
};

window.onload = () => {
    createNewCV('newButton');
    saveCV('saveButton');
    // load('loadCV');
    newCV();
};

}());