import { removeAllChildren } from './extensions';
import createHeader from './createHeader';
import createGrid from './createGrid';
import randomName from './randomName';

const newCV = () => {

    //TODO: abstract creating new cv to createNewCV in separate module
    const CV = document.getElementById('CV');
    CV.removeAllChildren();
    CV.appendChild(
        createHeader());
    CV.appendChild(
        createGrid());
};

export default newCV;