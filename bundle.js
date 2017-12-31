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

const createTextElement = (
    {
        text = 'text'
    } = {}) => {
    return createElement('p', {
        className: 'textElement canEdit deleteSelf',
        innerText: text,
        behaviors: new Map([
            [attachEditBehavior, ''],
            [attachActionContainer, 'delete']
        ])
    });
};

const createDescriptionElement = (
    {
        description = 'description',
        text = 'text'
    } = {}) => {
    return createElement('div', {
        className: 'descriptionElement deleteSelf',
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

const createListElement = (
    {
        description = 'description',
        children = [createTextElement()]
    } = {}) => {
    return createElement('div', {
        className: 'listElement',
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

const createDetailElement = (
    {
        text = 'detail'
    } = {}) => {
    return createElement('li', {
        className: 'detailElement canEdit deleteSelfAndParentIfLast',
        innerText: text,
        behaviors: new Map([
            [attachEditBehavior, ''],
            [attachActionContainer,
                ['addDetail', 'delete']]
        ])
    })
};

const createCompoundItem = (
    {
        name = 'name',
        description = 'description',
        additionalInfo = 'additional info'
    } = {},
    detailsChildren = [
        createDetailElement()
    ]) => {
    return createElement('div', {
        className: 'compoundItem',
        children: [
            createElement('p', {
                className: 'compoundItemName canEdit deleteParent',
                innerText: name,
                behaviors: new Map([
                    [attachEditBehavior, ''],
                    [attachActionContainer, 'delete']
                ])
            }),
            createElement('p', {
                className: 'compoundItemDescription canEdit deleteSelf',
                innerText: description,
                behaviors: new Map([
                    [attachEditBehavior, ''],
                    [attachActionContainer, 'delete']
                ])
            }),
            createElement('p', {
                className: 'compoundItemAdditionalInfo canEdit deleteSelf',
                innerText: additionalInfo,
                behaviors: new Map([
                    [attachEditBehavior, ''],
                    [attachActionContainer, 'delete']
                ])
            }),
            createElement('ul', {
                className: 'compoundItemDetails',
                children: detailsChildren
            })
        ]
    });
};

const createDateItem = (
    {
        date = `01/${new Date().getFullYear()} -- Present`,
        compoundItem = createCompoundItem()
    } = {}) => {
    return createElement('div', {
        className: 'dateItem',
        children: [
            createElement('p', {
                className: 'date canEdit deleteParent',
                innerText: date,
                behaviors: new Map([
                    [attachEditBehavior, ''],
                    [attachActionContainer, 'delete']
                ])
            }),
            compoundItem
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
                el.parentNode.parentNode.lastChild.insertAfter(
                    createSection({
                        columnid: el.parentNode.parentNode.id
                    }));
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

const createSection = (
    {
        columnid,
        name = 'section',
        nameColor = null
    } = {},
    children = []) => {

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

        const addToArgsMeta = (argsMeta, obj) => Object.assign(argsMeta, obj);

        const processTextElement = ([fstChild]) =>
            createTextElement({
                text: fstChild.textContent
            });

        const processDescriptionElement = ([fstChild, ...rest], argsMeta = {}) => {
            return !fstChild
                ? createDescriptionElement(argsMeta)
                : fstChild.classList.contains('description')
                    ? processDescriptionElement(
                        rest,
                        addToArgsMeta(argsMeta, {
                            description: fstChild.innerText
                        }))
                    : fstChild.classList.contains('descriptionText')
                        ? processDescriptionElement(
                            rest,
                            addToArgsMeta(argsMeta, {
                                text: fstChild.innerText
                            }))
                        : processDescriptionElement(rest, argsMeta);
        };

        const processListElement = ([fstChild, ...rest], [argsMeta = {}, ...argsChildren] = []) => {
            return !fstChild
                ? createListElement(argsMeta, argsChildren)
                : fstChild.classList.contains('description')
                    ? processListElement(
                        rest, [
                            addToArgsMeta(argsMeta, {
                                description: fstChild.innerText
                            })
                        ])
                    : fstChild.classList.contains('textElement')
                        ? processListElement(
                            rest, [
                                argsMeta,
                                ...argsChildren,
                                createTextElement({
                                    text: fstChild.innerText
                                })
                            ])
                        : processListElement(rest, [argsMeta, argsChildren]);
        };

        const processCompoundItem = ([fstChild, ...rest], [argsMeta = {}, ...argsChildren] = []) => {

            if (!fstChild) return createCompoundItem(argsMeta, argsChildren);
            else {
                const classList = fstChild.classList;
                switch (true) {
                    case classList.contains('compoundItemName'):
                        return processCompoundItem(rest, [
                            addToArgsMeta(argsMeta, {
                                name: fstChild.innerText
                            })
                        ]);
                    case classList.contains('compoundItemDescription'):
                        return processCompoundItem(rest, [
                            addToArgsMeta(argsMeta, {
                                description: fstChild.innerText
                            })
                        ]);
                    case classList.contains('compoundItemAdditionalInfo'):
                        return processCompoundItem(rest, [
                            addToArgsMeta(argsMeta, {
                                additionalInfo: fstChild.innerText
                            })
                        ]);
                    case classList.contains('compoundItemDetails'):
                        return processCompoundItem(fstChild.childNodes, [argsMeta]);
                    case classList.contains('detailElement'):
                        return processCompoundItem(rest, [
                            argsMeta,
                            ...argsChildren,
                            createDetailElement({
                                text: fstChild.innerText
                            })
                        ]);
                    default:
                        return processCompoundItem(rest, [argsMeta, ...argsChildren]);
                }
            }
        };

        const processDateItem = ([fstChild, ...rest], argsMeta = {}) => {
            return !fstChild
                ? createDateItem(argsMeta)
                : fstChild.classList.contains('date')
                    ? processDateItem(rest, addToArgsMeta(argsMeta, {
                        date: fstChild.innerText
                    }))
                    : fstChild.classList.contains('compoundItem')
                        ? processDateItem(rest, addToArgsMeta(argsMeta, {
                            compoundItem: processCompoundItem(fstChild.childNodes)
                        }))
                        : processDateItem(rest, argsMeta);
        };

        const processChildren = ([fstElement, ...rest], children = []) => {

            const processChild = fn => {
                return processChildren(
                    rest,
                    children.concat(
                        fn(fstElement.childNodes)
                    ));
            };

            if (!fstElement) return children;
            else {
                const classList = fstElement.classList;
                switch (true) {
                    case classList.contains('textElement'):
                        return processChild(
                            processTextElement);
                    case classList.contains('descriptionElement'):
                        return processChild(
                            processDescriptionElement);
                    case classList.contains('listElement'):
                        return processChild(
                            processListElement);
                    case classList.contains('compoundItem'):
                        return processChild(
                            processCompoundItem);
                    case classList.contains('dateItem'):
                        return processChild(
                            processDateItem);
                    default:
                        return processChildren(rest, children);
                }
            }
        };

        return fst.hasOwnProperty('name')
            ? createSection(
                {
                    columnid: id,
                    name: fst.name,
                    nameColor: fst.color
                },
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

const createNewCV = (id, header, grid) => {
    const CV = document.getElementById(id);
    CV.removeAllChildren();
    CV.appendChild(header);
    CV.appendChild(grid);
};

const newCV = () => {
    createNewCV('CV', createHeader(), createGrid());
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

        createNewCV(domCV.id, header, grid);
    };

    try {
        reader.readAsText(file);
    } catch (e) {
        if (e instanceof TypeError)
            console.log('no file selected, ', e.message);
        else
            console.log('unknown error', e.message);
    }

};

window.onload = () => {
    attachButtonBehavior('newCVButton', newCV);
    attachButtonBehavior('saveCVButton', saveCV);
    attachButtonBehavior('loadCVButton', loadCV);
    newCV();
};

}());
