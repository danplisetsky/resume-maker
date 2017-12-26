import attachButtonBehavior from './my/attachButtonBehavior';
import newCV from './my/newCV';
import saveCV from './my/saveCV';

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
    attachButtonBehavior('saveCVButton', saveCV);
    // load('loadCV');
    newCV();
};