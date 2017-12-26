import attachButtonBehavior from './my/attachButtonBehavior';
import newCV from './my/newCV';

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


window.onload = () => {
    attachButtonBehavior('newCVButton', newCV);
    // saveCV('saveButton');
    // load('loadCV');
    newCV();
};