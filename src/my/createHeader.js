import createElement from './createElement';
import attachBckgColorPicker from './attachBckgColorPicker';
import attachColorPicker from './attachColorPicker';
import attachEditBehavior from './attachEditBehavior';
import randomName from './randomName';


const createSubheader = ({ tag, id, name, color }) => {
    return createElement(tag, {
        id: id,
        className: 'canPickColor canEdit',
        innerText: name,
        style: {
            color: color
        },
        behaviors: new Map([
            [attachColorPicker, ''],
            [attachEditBehavior, '']
        ])
    });
};

const createHeader = (
    header = {
        backgroundColor: null
    },
    name = {
        tag: 'h1', id: 'name', name: randomName(), color: null
    },
    occupation = {
        tag: 'h2', id: 'occupation', name: 'software developer', color: null
    }   
) => {
    return createElement('div', {
        id: 'header',
        className: 'canPickBackgroundColor',
        style: {
            backgroundColor: header.backgroundColor
        },
        behaviors: new Map([
            [attachBckgColorPicker, '']
        ]),
        children: [
            createSubheader(name),
            createSubheader(occupation)           
        ]
    });
};

export default createHeader;