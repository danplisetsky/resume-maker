import { insertAfter, getClientXY, removeAllChildren } from './my/extensions';
import createElement from './my/createElement';
import createSection from './my/createSection';
import forEachElem from './my/forEachElem';
import deleteElementIfNotHoveredOver from './my/deleteElementIfNotHoveredOver';
import attachEditBehavior from './my/attachEditBehavior';









const attachBckgColorPickers = el => {

    const createColorPicker = () => {
        return colorPicker = createElement('input', {
            type: 'color',
            onchange: ev =>
                el.style.backgroundColor = ev.target.value
        });
    };

    el.addEventListener('dblclick', () =>
        createColorPicker().click());
};

const save = id => {
    const buttonSaveCV = document.getElementById(id);
    buttonSaveCV.onclick = ev => {
        const CV = document.getElementById('CV');
        const res = domJSON.toJSON(CV, {
            domProperties: [true, 'draggable', 'spellcheck', 'translate'],
            stringify: true
        });

        const name = document.getElementById('name').innerText + '.cv';
        const blob = new Blob([res], { type: "text/plain;charset=utf-8" });
        saveAs(blob, name);
    };
};

const load = id => {
    const buttonLoadCV = document.getElementById(id);
    buttonLoadCV.onchange = ev => {
        const file = buttonLoadCV.files[0];

        const reader = new FileReader();
        reader.onload = prEv => {
            const res = reader.result;
            const CV = document.getElementById('CV');
            const domCV = domJSON.toDOM(res);
            CV.parentNode.replaceChild(domCV, CV);
            wireupBehavior();
        };

        reader.readAsText(file);
    };
};






// const addSectionToColumn = CVGridColumn => {
//     forEachElem(`#${CVGridColumn}`)(column =>
//         column.appendChild(createSection()))
// };

// addSectionToColumn('fstColumn');



// const wireupBehavior = () => {
//     forEachElem('.canPickBackgroundColor')(attachBckgColorPickers);
//     forEachElem('.canEdit')(attachEditBehavior);
//     forEachElem('.canPickColor')(attachColorPickers);
// };




const newCV = () => {
    const cleanColumn = (column, [nameOfFirstSection]) => {
        column.removeAllChildren();
        column.appendChild(createSection(column, nameOfFirstSection))
    };

    forEachElem('#fstColumn')(cleanColumn, 'contact');
    forEachElem('#sndColumn')(cleanColumn, 'experience');
};

window.onload = () => {
    newCV();
    // wireupBehavior();
    save('saveCV');
    load('loadCV');
};