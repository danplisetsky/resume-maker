import { removeAllChildren } from './extensions';
import createHeader from './createHeader';
import createGrid from './createGrid';
import randomName from './randomName';
import createNewCV from './createNewCV';

const newCV = () => {
    createNewCV('CV', createHeader(), createGrid());
};

export default newCV;