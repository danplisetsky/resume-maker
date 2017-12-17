import forEachElem from './forEachElem';
import createElement from './createElement';
import deleteElementIfNotHoveredOver from './deleteElementIfNotHoveredOver';
import createSection from './createSection';
import DeleteAction from './deleteAction';
import attachEditBehavior from './attachEditBehavior';

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
                innerText: 'description'
            }),
            createElement('p', {
                className: 'canEdit deleteSelf',
                innerText: 'text'
            })
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
                throw new TypeError('wrong delete class');
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
            el.remove();
            break;
        case DeleteAction.DeleteSelfAndParentIfLast:
            if (el.parentNode.querySelectorAll('li').length === 1)
                el.parentNode.remove();
            else
                el.remove();
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
    return actionName.name == 'createDeleteBehavior'
        ? () => createDeleteBehavior(el)
        : actionName.name === 'createSection'
            ? () =>
                el.parentNode.parentNode.lastChild.insertAfter(actionName(el))
            : () =>
                el.parentNode.lastChild.insertAfter(actionName());
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
            (deleteElementIfNotHoveredOver, ev.getClientXY(), { left: 10 })
    );
};

export default attachActionContainer;