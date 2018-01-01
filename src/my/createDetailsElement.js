import createDetailElement from "./createDetailElement";
import createElement from './createElement';

const createDetailsElement = (children = [
    createDetailElement()
]) => {
    return createElement('ul', {
        className: 'compoundItemDetails',
        children: children
    })
};

export default createDetailsElement;