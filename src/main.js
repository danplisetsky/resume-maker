import { insertAfter, getClientXY, removeAllChildren } from './my/extensions';
import createElement from './my/createElement';
import createSection from './my/createSection';
import forEachElem from './my/forEachElem';
import deleteElementIfNotHoveredOver from './my/deleteElementIfNotHoveredOver';
import attachEditBehavior from './my/attachEditBehavior';
import attachColorPicker from './my/attachColorPicker'
import attachBckgColorPicker from './my/attachBckgColorPicker';

// const save = id => {
//     const buttonSaveCV = document.getElementById(id);
//     buttonSaveCV.onclick = ev => {
//         const CV = document.getElementById('CV');
//         const res = domJSON.toJSON(CV, {
//             domProperties: [true, 'draggable', 'spellcheck', 'translate'],
//             stringify: true
//         });

//         const name = document.getElementById('name').innerText + '.cv';
//         const blob = new Blob([res], { type: "text/plain;charset=utf-8" });
//         saveAs(blob, name);
//     };
// };

// const load = id => {
//     const buttonLoadCV = document.getElementById(id);
//     buttonLoadCV.onchange = ev => {
//         const file = buttonLoadCV.files[0];

//         const reader = new FileReader();
//         reader.onload = prEv => {
//             const res = reader.result;
//             const CV = document.getElementById('CV');
//             const domCV = domJSON.toDOM(res);
//             CV.parentNode.replaceChild(domCV, CV);
//             wireupBehavior();
//         };

//         reader.readAsText(file);
//     };
// };

const wireupBehavior = () => {
    forEachElem('.canPickBackgroundColor')(attachBckgColorPicker);
    forEachElem('.canEdit')(attachEditBehavior);
    forEachElem('.canPickColor')(attachColorPicker);
    // save('saveCV');
    // load('loadCV');
};

const newCV = () => {
    const cleanColumn = (column, [nameOfFirstSection]) => {
        column.removeAllChildren();
        column.appendChild(createSection(column, nameOfFirstSection))
    };

    forEachElem('#fstColumn')(cleanColumn, 'contact');
    forEachElem('#sndColumn')(cleanColumn, 'experience');
};

window.onload = () => {
    wireupBehavior(); //for elements always present on page
    newCV();
};