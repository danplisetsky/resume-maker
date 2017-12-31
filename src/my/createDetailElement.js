import createElement from './createElement';
import attachEditBehavior from './attachEditBehavior';
import attachActionContainer from './attachActionContainer';

const createDetailElement = (
    {
        text = 'detail'
    } = {}) => {
    return createElement('li', {
        className: 'detailElement canEdit deleteSelfAndParentIfLast',
        innerText: text,
        behaviors: new Map([
            [attachEditBehavior, ''],
            [attachActionContainer,
                ['addDetail', 'delete']]
        ])
    })
};

export default createDetailElement;