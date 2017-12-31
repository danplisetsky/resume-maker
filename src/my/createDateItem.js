import createElement from './createElement';
import attachEditBehavior from './attachEditBehavior';
import attachActionContainer from './attachActionContainer';
import createCompoundItem from './createCompoundItem';

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

export default createDateItem;