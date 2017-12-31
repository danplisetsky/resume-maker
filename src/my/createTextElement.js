import createElement from './createElement';
import attachEditBehavior from './attachEditBehavior';
import attachActionContainer from './attachActionContainer';

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

export default createTextElement;