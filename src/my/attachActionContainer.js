import forEachElem from './forEachElem';
import createElement from './createElement';
import { insertAfter, removeSelfAndNextSibling, getClientXY } from './extensions';
import deleteElementIfNotHoveredOver from './deleteElementIfNotHoveredOver';
import createSection from './createSection';
import DeleteAction from './deleteAction';
import attachEditBehavior from './attachEditBehavior';
import createTextElement from './createTextElement';
import createDescriptionElement from './createDescriptionElement';
import createListElement from './createListElement';
import createCompoundItem from './createCompoundItem';
import createDetailElement from './createDetailElement';
import createDateItem from './createDateItem';
import attachMoveUpBehavior from './attachMoveUpBehavior';
import attachMoveDownBehavior from './attachMoveDownBehavior';

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
            removeSelfAndNextSibling(el); //also removes actionContainer
            break;
        case DeleteAction.DeleteSelfAndParentIfLast:
            if (el.parentNode.querySelectorAll(el.tagName).length === 1)
                el.parentNode.remove();
            else
                removeSelfAndNextSibling(el); //also removes actionContainer
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
                insertAfter(
                    el.parentNode.parentNode.lastChild,
                    createSection({
                        columnid: el.parentNode.parentNode.id
                    })
                );
        case 'createDetailElement':
            return () => insertAfter(
                el,
                createDetailElement()
            );
        case 'attachMoveUpBehavior':
        case 'attachMoveDownBehavior':
            return () => actionName(el);
        default:
            return () => insertAfter(
                el.parentNode.lastChild,
                actionName()
            );
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
        ['moveUp', attachMoveUpBehavior],
        ['moveDown', attachMoveDownBehavior],
        ['delete', createDeleteBehavior]
    ]);

    return [...actionIcons]
        .filter(([key]) => icons.includes(key))
        .map(item => createIcon(item));
};

const attachActionContainer = (el, icons) => {

    const addMoveUp = (el) => {
        return el.className.includes('deleteParent')
            ? addMoveUp(el.parentNode)
            : !el.previousElementSibling
                || el.previousElementSibling.className.includes('deleteParent')
                || el.parentNode.classList.contains('compoundItem')
                ? ''
                : 'moveUp';
    };

    const addMoveDown = (el) => {
        return el.className.includes('deleteParent')
            ? addMoveDown(el.parentNode)
            : !el.nextElementSibling
                || el.parentNode.classList.contains('compoundItem')
                ? ''
                : 'moveDown';
    }

const createActionContainer = (left, top) => {
    const actionContainer = createElement('div', {
        className: 'actionContainer',
        style: {
            left: `${left + 3}px`,
            top: `${top + 3}px`
        },
        children: createActionIcons(el, [
            ...icons,
            addMoveUp(el),
            addMoveDown(el)
        ]),
        onmouseleave: ev => actionContainer.remove()
    });

    return actionContainer;
};

el.addEventListener('mouseover', ev =>
    insertAfter(
        el,
        createActionContainer(
            ev.currentTarget.offsetLeft + ev.currentTarget.offsetWidth,
            ev.target.offsetTop)
    )
);

el.addEventListener('mouseleave', ev =>
    forEachElem('.actionContainer')
        (deleteElementIfNotHoveredOver, getClientXY(ev), { left: 5 })
);
};

export default attachActionContainer;