import createElement from "./createElement";
import attachBckgColorPicker from "./attachBckgColorPicker";
import attachColorPicker from "./attachColorPicker";
import attachEditBehavior from "./attachEditBehavior";

const createHeader = (name, occupation) => {
    return createElement('div', {
        id: 'header',
        className: 'canPickBackgroundColor',
        behaviors: new Map([
            [attachBckgColorPicker, '']
        ]),
        children: [
            createElement('h1', {
                id: 'name',
                className: 'canPickColor canEdit',
                innerText: name,
                behaviors: new Map([
                    [attachColorPicker, ''],
                    [attachEditBehavior, '']
                ])
            }),
            createElement('h2', {
                id: 'occupation',
                className: 'canPickColor canEdit',
                innerText: occupation,
                behaviors: new Map([
                    [attachColorPicker, ''],
                    [attachEditBehavior, '']
                ])
            })
        ]
    });
};

export default createHeader;