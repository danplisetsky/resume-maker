import createElement from './createElement';
import attachEditBehavior from './attachEditBehavior';
import attachActionContainer from './attachActionContainer';
import createTextElement from './createTextElement';

const createListElement = (
    {
        description = 'description'
    } = {},
    children = [
        createTextElement()
    ]) => {
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

export default createListElement;