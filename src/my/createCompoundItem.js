import createElement from './createElement';
import attachEditBehavior from './attachEditBehavior';
import attachActionContainer from './attachActionContainer';
import createDetailElement from './createDetailElement';

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

export default createCompoundItem;