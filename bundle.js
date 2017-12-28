(function () {
'use strict';

const attachButtonBehavior = (id, callback) => {
    const button = document.getElementById(id);
    if (button.tagName === 'INPUT' && button.type === 'file')
        button.onchange = callback;
    else
        button.onclick = callback;
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

const forEachElem = selector => {
    return (action, ...args) => {
        const els = [...document.querySelectorAll(selector)];
        els.forEach(el => action(el, args));
    }
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

const randomName = () => {
    return Math.random() < 0.5
        ? 'John Doe'
        : 'Jane Doe';
};

const createSubheader = ({ tag, id, name, color }) => {
    return createElement(tag, {
        id: id,
        className: 'canPickColor canEdit',
        innerText: name,
        style: {
            color: color
        },
        behaviors: new Map([
            [attachColorPicker, ''],
            [attachEditBehavior, '']
        ])
    });
};

const createHeader = (
    header = {
        backgroundColor: null
    },
    name = {
        tag: 'h1', id: 'name', name: randomName(), color: null
    },
    occupation = {
        tag: 'h2', id: 'occupation', name: 'software developer', color: null
    }   
) => {
    return createElement('div', {
        id: 'header',
        className: 'canPickBackgroundColor',
        style: {
            backgroundColor: header.backgroundColor
        },
        behaviors: new Map([
            [attachBckgColorPicker, '']
        ]),
        children: [
            createSubheader(name),
            createSubheader(occupation)           
        ]
    });
};

const DeleteAction = {
    DeleteParent: 1,
    DeleteSelf: 2,
    DeleteSelfAndParentIfLast: 3,
    DeleteParentIfNotLast: 4
};

const createTextElement = (text = 'text') => {
    return createElement('p', {
        className: 'textElement canEdit deleteSelf',
        innerText: text,
        behaviors: new Map([
            [attachEditBehavior, ''],
            [attachActionContainer, 'delete']
        ])
    });
};

const createDescriptionElement = (description = 'description', text = 'text') => {
    return createElement('div', {
        className: 'descriptionElement inline deleteSelf',
        behaviors: new Map([
            [attachActionContainer, 'delete']
        ]),
        children: [
            createElement('p', {
                className: 'description canEdit',
                innerText: description,
                behaviors: new Map([
                    [attachEditBehavior, '']
                ])
            }),
            createElement('p', {
                className: 'descriptionText canEdit',
                innerText: text,
                behaviors: new Map([
                    [attachEditBehavior, '']
                ])
            })
        ]
    });
};

const createListElement = (description = 'description', children = [createTextElement()]) => {
    return createElement('div', {
        className: 'listElement multiple',
        children: [
            createElement('p', {
                className: 'description canEdit deleteParent',
                innerText: description,
                behaviors: new Map([
                    [attachEditBehavior, ''],
                    [attachActionContainer,
                        ['addText', 'delete']]
                ])
            }),
            ...children
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
                el.parentNode.parentNode.lastChild.insertAfter(createSection(el.parentNode.parentNode.id));
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

const createSection = (columnid, name = 'section', nameColor = null, children = []) => {
    
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
                style: {
                    color: nameColor
                },
                behaviors: columnid === 'fstColumn'
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
            }),
            ...children
        ]
    });
};

const createGrid = (
    fstColumn = {
        id: 'fstColumn',
        children: [
            [
                { name: 'contact', color: null }
            ]
        ]
    },
    sndColumn = {
        id: 'sndColumn',
        children: [
            [
                { name: 'experience', color: null }
            ]
        ]
    }) => {

    const makeCreateSection = (id, [fst, ...rest]) => {

        const processTextElement = node =>
            createTextElement(node.innerText);

        const processDescriptionElement = ([fstChild, ...rest], args = []) => {
            return !fstChild
                ? createDescriptionElement(...args)
                : fstChild.classList.contains('description')
                    ? processDescriptionElement(rest, args.concat(fstChild.innerText))
                    : fstChild.classList.contains('descriptionText')
                        ? processDescriptionElement(rest, args.concat(fstChild.innerText))
                        : processDescriptionElement(rest, args);
        };

        const processListElement = ([fstChild, ...rest], args = []) => {
            return !fstChild
                ? args
                : fstChild.classList.contains('description')
                    ? createListElement(fstChild.innerText, processListElement(rest))
                    : fstChild.classList.contains('textElement')
                        ? processListElement(
                            rest,
                            args.concat(
                                createTextElement(fstChild.innerText)))
                        : processListElement(rest, args);
        };

        const processChildren = ([fstElement, ...rest], children = []) => {
            if (!fstElement) return children;
            else {
                const classList = fstElement.classList;
                switch (true) {
                    case classList.contains('textElement'):
                        return processChildren(rest,
                            children.concat(
                                processTextElement(fstElement)));
                    case classList.contains('descriptionElement'):
                        return processChildren(rest,
                            children.concat(
                                processDescriptionElement(fstElement.childNodes)));
                    case classList.contains('listElement'):
                        return processChildren(rest,
                            children.concat(
                                processListElement(fstElement.childNodes)));
                    default:
                        return processChildren(rest, children);
                }
            }
        };

        return fst.hasOwnProperty('name')
            ? createSection(
                id,
                fst.name,
                fst.color,
                processChildren(rest))
            : (() => { throw 'wrongly formatted CV!' });
    };

    const createColumn = ({
        id,
        children
    }) => {
        const sections = children.map(section => makeCreateSection(id, section));
        return createElement('div', {
            id: id,
            className: 'subgrid',
            children: sections
        });
    };

    return createElement('div', {
        id: 'grid',
        children: [
            createColumn(fstColumn),
            createColumn(sndColumn)
        ]
    });
};

const newCV = () => {

    //TODO: abstract creating new cv to createNewCV in separate module
    const CV = document.getElementById('CV');
    CV.removeAllChildren();
    CV.appendChild(
        createHeader());
    CV.appendChild(
        createGrid());
};

const saveCV = () => {
    const CV = document.getElementById('CV');

    const jsonOutput = domJSON.toJSON(CV, {
        attributes: [false, 'id', 'class', 'style'],
        domProperties: [false, 'alt'],
        stringify: true
    });

    const name = document.getElementById('name').innerText + '.cv';
    const blob = new Blob([jsonOutput], {
        type: "text/plain;charset=utf-8"
    });
    saveAs(blob, name);
};

const processHeader = (node, id) => {
    if (!node || !node.childNodes) return;
    else {
        switch (node.id) {
            case 'header':
                return createHeader(
                    {
                        backgroundColor: node.style.backgroundColor
                    },
                    processHeader(node.firstElementChild, 'name'),
                    processHeader(node.firstElementChild, 'occupation')
                );
            case id:
                return {
                    tag: node.tagName,
                    id: node.id,
                    name: node.innerText,
                    color: node.style.color
                };
            default:
                return processHeader(node.nextSibling, id);
        }
    }
};

const processGrid = node => {

    const processSection = ([fstElement, ...rest], children = []) => {
        return !fstElement
            ? children
            : fstElement.classList.contains('nameOfSection')
                ? processSection(
                    rest,
                    children.concat({
                        name: fstElement.innerText,
                        color: fstElement.style.color
                    }))
                : processSection(rest, children.concat(fstElement))
    };

    const processSubgrid = ([fstSection, ...rest], children = []) => {
        return !fstSection
            ? children
            : processSubgrid(
                rest,
                [
                    ...children,
                    processSection(fstSection.childNodes)
                ]);
    };

    return (!node || !node.childNodes)
        ? (() => { throw 'wrongly formatted cv!' })
        : node.id === 'grid'
            ? createGrid(
                processGrid(node.firstElementChild),
                processGrid(node.lastElementChild)
            )
            : {
                id: node.id,
                children: processSubgrid(node.childNodes)
            };
};


const loadCV = ev => {
    const file = ev.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
        const domCV = domJSON.toDOM(reader.result)
            .firstElementChild;
        const header = processHeader(
            [...domCV.childNodes].find(cn => cn.id === 'header'));
        const grid = processGrid(
            [...domCV.childNodes].find(cn => cn.id === 'grid'));

        //TODO: call createNewCV here

        const CV = document.getElementById('CV');
        CV.removeAllChildren();
        CV.appendChild(header);
        CV.appendChild(grid);
    };

    reader.readAsText(file);

};

window.onload = () => {
    attachButtonBehavior('newCVButton', newCV);
    attachButtonBehavior('saveCVButton', saveCV);
    attachButtonBehavior('loadCVButton', loadCV);
    newCV();
};

}());
