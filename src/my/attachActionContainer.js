import forEachElem from './forEachElem';
import createElement from './createElement';
import deleteElementIfNotHoveredOver from './deleteElementIfNotHoveredOver';
import createSection from './createSection';
import DeleteAction from './deleteAction';
import attachEditBehavior from './attachEditBehavior';
import { removeSelfAndNextSibling } from './extensions';
import createTextElement from './createTextElement';
import createDescriptionElement from './createDescriptionElement';
import createListElement from './createListElement';

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

export default attachActionContainer;