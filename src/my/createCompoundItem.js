import createElement from './createElement';
import attachEditBehavior from './attachEditBehavior';
import attachActionContainer from './attachActionContainer';
import createDetailElement from './createDetailElement';
import createTextElement from './createTextElement';
import createDetailsElement from './createDetailsElement';

const createCompoundItem = (
    {
        name = 'name',
    } = {},
    children = [
        createTextElement({
            text: 'description',
            className: 'compoundItemDescription'
        }),
        createTextElement({
            text: 'additional info',
            className: 'compoundItemAdditionalInfo'
        }),
        createDetailsElement()
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
            ...children        
        ]
    });
};

export default createCompoundItem;