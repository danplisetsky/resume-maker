import forEachElem from './my/forEachElem';
import createSection from './my/createSection';
import attachEditBehavior from './my/attachEditBehavior';
import attachColorPicker from './my/attachColorPicker'
import attachBckgColorPicker from './my/attachBckgColorPicker';
import randomName from './my/randomName';

const createNewCV = id => {
    const buttonNewCV = document.getElementById(id);
    buttonNewCV.onclick = _ => newCV();
};

const setInitialAttributes = id => {
    const elem = document.getElementById(id);
    return (text = elem.innerHTML, color = null) => {
        elem.innerHTML = text;
        elem.className.includes('canPickBackgroundColor')
            ? elem.style.backgroundColor = color
            : elem.style.color = color;
    };
};


const saveCV = id => {
    const buttonSaveCV = document.getElementById(id);
    buttonSaveCV.onclick = ev => {

        //save header info (name, occupation, colors)
        //save cv        

        // const CV = document.getElementById('CV');
        // const res = domJSON.toJSON(CV, {
        //     domProperties: [true, 'draggable', 'spellcheck', 'translate'],
        //     stringify: true
        // });

        // const name = document.getElementById('name').innerText + '.cv';
        // const blob = new Blob([res], { type: "text/plain;charset=utf-8" });
        // saveAs(blob, name);
    };
};

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
};

const newCV = () => {
    const cleanColumn = (column, [nameOfFirstSection]) => {
        column.removeAllChildren();
        column.appendChild(createSection(column, nameOfFirstSection))
    };

    setInitialAttributes('header')();
    setInitialAttributes('name')(randomName());
    setInitialAttributes('occupation')('software developer');
    wireupBehavior(); //for elements always present on page

    forEachElem('#fstColumn')(cleanColumn, 'contact');
    forEachElem('#sndColumn')(cleanColumn, 'experience');
};

window.onload = () => {
    createNewCV('newButton');
    saveCV('saveButton');
    // load('loadCV');
    newCV();
};