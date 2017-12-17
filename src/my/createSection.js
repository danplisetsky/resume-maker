import createElement from './createElement';
import attachEditBehavior from './attachEditBehavior';
import attachColorPicker from './attachColorPicker';
import attachActionContainer from './attachActionContainer';

const createSection = (el, name = 'section') => {
    
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
                behaviors: el.id === 'fstColumn' || el.parentNode.parentNode.id === 'fstColumn'
                    ? new Map([
                        ...defaultBehaviors.entries(),
                        [attachActionContainer,
                            ['addText', 'addDescription', 'addList', 'addAfter', 'delete']]
                    ])
                    : new Map([
                        ...defaultBehaviors.entries(),
                        [attachActionContainer,
                            ['addCompoundItem', 'addDate', 'addAfter', 'delete']]   
                    ])
            })
        ]
    });
};

export default createSection;