import createElement from './createElement';
import attachEditBehavior from './attachEditBehavior';
import attachColorPicker from './attachColorPicker';
import attachActionContainer from './attachActionContainer';

const createSection = (columnid, name = 'section') => {
    
    const defaultBehaviors = new Map([
        [attachEditBehavior, ''],
        [attachColorPicker, '']
    ]);

    return createElement('div', {
        className: 'section',
        children: [
            createElement('h3', {
                className:
                    'nameOfSection canPickColor  deleteParentIfNotLast',
                innerText: name,
                behaviors: columnid === 'fstColumn'
                    ? new Map([
                        ...defaultBehaviors.entries(),
                        [attachActionContainer,
                            ['addText', 'addDescription', 'addList', 'addAfter', 'delete']]
                    ])
                    : new Map([
                        ...defaultBehaviors.entries(),
                        [attachActionContainer,
                            ['addCompoundItem', 'addDateItem', 'addAfter', 'delete']]   
                    ])
            })
        ]
    });
};

export default createSection;