import { removeAllChildren } from './extensions';

const createNewCV = (id, header, grid) => {
    const CV = document.getElementById(id);
    CV.removeAllChildren();
    CV.appendChild(header);
    CV.appendChild(grid);
};

export default createNewCV;