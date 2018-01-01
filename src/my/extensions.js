const insertAfter = (referenceElement, newElement) => {
    referenceElement.parentNode.insertBefore(newElement, referenceElement.nextElementSibling);
};

const removeAllChildren = el => {
    while (el.hasChildNodes())
        el.removeChild(el.lastChild);
}

const removeSelfAndNextSibling = el => {
    el.nextElementSibling.remove();
    el.remove();
}

const moveUp = el => {
    el.parentNode.insertBefore(el, el.previousElementSibling);
};

const moveDown = el => {
    insertAfter(el.nextElementSibling, el);
}

const getClientXY = mouseEvent => {
    return [mouseEvent.clientX, mouseEvent.clientY]
};

export { insertAfter, removeAllChildren, removeSelfAndNextSibling, moveUp, moveDown, getClientXY };